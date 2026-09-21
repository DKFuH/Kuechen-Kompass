<?php
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => !empty($_SERVER['HTTPS']),
]);
require dirname(__DIR__) . '/bootstrap.php';
require dirname(__DIR__) . '/delivery.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Methode nicht erlaubt.'], 405);
}

try {
    $input = json_decode((string) file_get_contents('php://input'), true, 64, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    json_response(['ok' => false, 'message' => 'Ungültige Anfrage.'], 400);
}

if (!is_array($input)) {
    json_response(['ok' => false, 'message' => 'Ungültige Anfrage.'], 400);
}
if (!empty($input['website'])) {
    json_response(['ok' => true]);
}
if (!hash_equals((string) ($_SESSION['csrf_token'] ?? ''), (string) ($input['csrf_token'] ?? ''))) {
    json_response(['ok' => false, 'message' => 'Die Sitzung ist abgelaufen. Bitte laden Sie die Seite neu.'], 419);
}

$name = clean_text($input['name'] ?? '', 120);
$email = filter_var(clean_text($input['email'] ?? '', 190), FILTER_VALIDATE_EMAIL);
$phone = clean_text($input['phone'] ?? '', 60);
$postalCode = clean_text($input['postal_code'] ?? '', 16);
$city = clean_text($input['city'] ?? '', 120);
$consent = filter_var($input['consent'] ?? false, FILTER_VALIDATE_BOOLEAN);
$visitorId = normalize_visitor_id($input['visitor_id'] ?? '');
$rawAnswers = is_array($input['answers'] ?? null) ? $input['answers'] : [];
$rawDetails = is_array($input['details'] ?? null) ? $input['details'] : [];

if ($name === '' || !$email || !$consent) {
    json_response(['ok' => false, 'message' => 'Bitte prüfen Sie Name, E-Mail-Adresse und Einwilligung.'], 422);
}
if (count($rawAnswers) > 30 || strlen((string) json_encode($rawAnswers)) > 30000 || strlen((string) json_encode($rawDetails)) > 5000) {
    json_response(['ok' => false, 'message' => 'Die Anfrage ist zu umfangreich.'], 413);
}

$answers = normalize_answers($rawAnswers);
$details = normalize_details($rawDetails);
$answers['room_dimensions'] = isset($details['room_dimensions']) ? ['filled'] : [];
$answers['special_wishes'] = isset($details['special_wishes']) ? ['filled'] : [];
foreach (style_question_ids() as $requiredAnswer) {
    if (empty($answers[$requiredAnswer])) {
        json_response(['ok' => false, 'message' => 'Das Stilprofil ist unvollständig. Bitte prüfen Sie Ihre Antworten.'], 422);
    }
}
$result = calculate_result($answers);

$pdo = database();
prune_submissions($pdo);
$ipHash = client_ip_hash();
$rate = $pdo->prepare("SELECT COUNT(*) FROM submissions WHERE ip_hash = :ip AND created_at >= datetime('now', '-15 minutes')");
$rate->execute(['ip' => $ipHash]);
if ((int) $rate->fetchColumn() >= 5) {
    json_response(['ok' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'], 429);
}

$publicId = bin2hex(random_bytes(8));
$createdAt = gmdate('Y-m-d H:i:s');
$countedQuestionIds = array_values(array_filter(array_keys(answer_schema()), static fn (string $id): bool => $id !== 'special_wishes'));
$answeredCount = count(array_filter($countedQuestionIds, static fn (string $id): bool => !empty($answers[$id])));
$project = [
    'callback' => filter_var($input['callback'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'completion' => (int) round($answeredCount / max(1, count($countedQuestionIds)) * 100),
    'skipped' => normalize_skipped($input['skipped'] ?? [], $answers),
    'source' => clean_text($input['source'] ?? 'kuechen-kompass', 80),
    'visitor_id' => $visitorId,
];

$statement = $pdo->prepare(
    'INSERT INTO submissions (
        public_id, created_at, ip_hash, name, email, phone, postal_code, city,
        result_title, result_json, answers_json, details_json, project_json, consent_at, visitor_id
    ) VALUES (
        :public_id, :created_at, :ip_hash, :name, :email, :phone, :postal_code, :city,
        :result_title, :result_json, :answers_json, :details_json, :project_json, :consent_at, :visitor_id
    )'
);
$statement->execute([
    'public_id' => $publicId,
    'created_at' => $createdAt,
    'ip_hash' => $ipHash,
    'name' => $name,
    'email' => $email,
    'phone' => $phone ?: null,
    'postal_code' => $postalCode ?: null,
    'city' => $city ?: null,
    'result_title' => clean_text($result['title'], 180),
    'result_json' => json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'answers_json' => json_encode($answers, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'details_json' => json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'project_json' => json_encode($project, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'consent_at' => $createdAt,
    'visitor_id' => $visitorId ?: null,
]);

$payload = [
    'event' => 'kuechen_kompass.submitted',
    'submission_id' => $publicId,
    'created_at' => $createdAt . 'Z',
    'contact' => ['name' => $name, 'email' => $email, 'phone' => $phone, 'postal_code' => $postalCode, 'city' => $city],
    'result' => $result,
    'answers' => $answers,
    'details' => $details,
    'project' => $project,
];

$delivery = attempt_delivery($pdo, app_config(), $publicId, $payload);
json_response([
    'ok' => true,
    'submission_id' => $publicId,
    'delivery_pending' => $delivery['pending'],
], $delivery['pending'] ? 202 : 201);

function answer_schema(): array
{
    return [
        'feeling' => [['calm', 'warm', 'bold', 'elegant'], 4],
        'visual_language' => [['flat', 'soft', 'framed', 'architectural'], 1],
        'palette' => [['sand', 'light', 'earth', 'dark'], 2],
        'materials' => [['wood', 'stone', 'lacquer', 'metal', 'glass'], 3],
        'handles' => [['handleless', 'edge', 'handle'], 1],
        'room_concept' => [['open', 'separate', 'unsure'], 1],
        'kitchen_shape' => [['single_row', 'double_row', 'u_shape', 'l_shape', 'island', 'unknown'], 1],
        'room_dimensions' => [['filled'], 1],
        'household' => [['solo', 'couple', 'family', 'guests'], 4],
        'cooking' => [['fresh', 'quick', 'baking', 'hosting'], 4],
        'storage' => [['order', 'workspace', 'ergonomics', 'together'], 1],
        'appliances' => [['oven', 'steamer', 'hob', 'fridge', 'fridge_freezer', 'dishwasher', 'microwave'], 7],
        'extractor_type' => [['exhaust', 'recirculation', 'unsure'], 1],
        'extractor_style' => [['cabinet', 'hood', 'hob_integrated', 'unsure'], 1],
        'waste_separation' => [['integrated', 'separate', 'open'], 1],
        'lighting' => [['niche', 'cabinet_light', 'drawer_light', 'plinth_light', 'ceiling_spots'], 5],
        'project_time' => [['0_3', '3_6', '6_12', 'ideas'], 1],
        'budget' => [['under_15', '15_25', '25_40', 'over_40', 'unknown'], 1],
        'special_wishes' => [['filled'], 1],
    ];
}

function style_question_ids(): array
{
    return ['feeling', 'visual_language', 'palette', 'materials', 'handles'];
}

function normalize_answers(array $answers): array
{
    $normalized = [];
    foreach (answer_schema() as $questionId => [$allowed, $max]) {
        $values = is_array($answers[$questionId] ?? null) ? $answers[$questionId] : [];
        $values = array_values(array_unique(array_filter(
            $values,
            static fn (mixed $value): bool => is_string($value) && in_array($value, $allowed, true)
        )));
        if ($questionId === 'appliances' && in_array('fridge_freezer', $values, true)) {
            $values = array_values(array_filter($values, static fn (string $value): bool => $value !== 'fridge'));
        }
        $normalized[$questionId] = array_slice($values, 0, $max);
    }
    return $normalized;
}

function normalize_details(array $details): array
{
    $normalized = [];
    $dimensions = is_array($details['room_dimensions'] ?? null) ? $details['room_dimensions'] : [];
    $cleanDimensions = [];
    foreach (['length', 'width', 'height'] as $field) {
        $value = str_replace(',', '.', trim((string) ($dimensions[$field] ?? '')));
        if ($value !== '' && preg_match('/^\d{1,5}(?:\.\d)?$/', $value) && (float) $value > 0) {
            $cleanDimensions[$field] = $value;
        }
    }
    if ($cleanDimensions !== []) {
        $normalized['room_dimensions'] = $cleanDimensions;
    }
    $wishes = clean_text($details['special_wishes'] ?? '', 1000);
    if ($wishes !== '') {
        $normalized['special_wishes'] = $wishes;
    }
    return $normalized;
}

function normalize_skipped(mixed $skipped, array $answers): array
{
    if (!is_array($skipped)) {
        return [];
    }
    $known = array_keys(answer_schema());
    return array_values(array_unique(array_filter(
        $skipped,
        static fn (mixed $id): bool => is_string($id) && in_array($id, $known, true) && empty($answers[$id])
    )));
}

function normalize_visitor_id(mixed $value): string
{
    $value = trim((string) $value);
    return preg_match('/^[A-Za-z0-9._:-]{8,128}$/', $value) ? $value : '';
}

function calculate_result(array $answers): array
{
    $styles = [
        'minimal' => ['label' => 'Warm Minimal', 'description' => 'Klare Linien, ruhige Flächen und eine warme Grundstimmung bilden Ihre ideale Küchenwelt.'],
        'natural' => ['label' => 'Natürlich Wohnlich', 'description' => 'Authentische Materialien und eine wohnliche Atmosphäre stehen bei Ihnen im Mittelpunkt.'],
        'japandi' => ['label' => 'Soft Japandi', 'description' => 'Reduktion, handwerkliche Details und natürliche Ruhe prägen Ihre persönliche Stilwelt.'],
        'urban' => ['label' => 'Urban Architecture', 'description' => 'Starke Materialien, klare Architektur und bewusste Kontraste geben Ihrer Küche Charakter.'],
        'classic' => ['label' => 'Modern Classic', 'description' => 'Zeitlose Eleganz trifft bei Ihnen auf feine Details und moderne Funktion.'],
    ];
    $weights = [
        'calm' => ['japandi' => 3, 'minimal' => 2],
        'warm' => ['natural' => 3, 'japandi' => 1, 'classic' => 1],
        'bold' => ['urban' => 3, 'minimal' => 1],
        'elegant' => ['classic' => 3, 'minimal' => 1],
        'flat' => ['minimal' => 3, 'urban' => 1],
        'soft' => ['natural' => 3, 'japandi' => 2],
        'framed' => ['classic' => 3, 'natural' => 1],
        'architectural' => ['urban' => 3, 'minimal' => 1],
        'sand' => ['japandi' => 3, 'natural' => 2, 'minimal' => 1],
        'light' => ['minimal' => 3, 'japandi' => 1],
        'earth' => ['natural' => 3, 'classic' => 1],
        'dark' => ['urban' => 3, 'classic' => 1],
        'wood' => ['natural' => 3, 'japandi' => 2],
        'stone' => ['japandi' => 3, 'minimal' => 2, 'urban' => 1],
        'lacquer' => ['minimal' => 3, 'classic' => 1],
        'metal' => ['urban' => 3, 'classic' => 1],
        'glass' => ['classic' => 3, 'urban' => 1],
        'handleless' => ['japandi' => 3, 'minimal' => 2],
        'edge' => ['minimal' => 3, 'urban' => 1],
        'handle' => ['classic' => 3, 'natural' => 2],
    ];

    $scores = array_fill_keys(array_keys($styles), 0.0);
    $strongMatches = array_fill_keys(array_keys($styles), 0.0);
    foreach (style_question_ids() as $questionId) {
        $values = $answers[$questionId] ?? [];
        if ($values === []) {
            continue;
        }
        $questionScores = array_fill_keys(array_keys($styles), 0.0);
        $count = count($values);
        foreach ($values as $answer) {
            $optionWeights = $weights[$answer] ?? [];
            $optionMax = $optionWeights === [] ? 0 : max($optionWeights);
            foreach ($optionWeights as $style => $points) {
                $questionScores[$style] += $points / 3;
                if ($optionMax > 0 && $points === $optionMax) {
                    $strongMatches[$style] += 1 / $count;
                }
            }
        }
        foreach ($scores as $style => $_) {
            $scores[$style] += $questionScores[$style] / $count;
        }
    }

    $total = max(0.000001, array_sum($scores));
    $ranked = [];
    foreach ($scores as $id => $score) {
        $ranked[] = [
            'id' => $id,
            'score' => round($score, 6),
            'strongMatches' => round($strongMatches[$id], 6),
            'percent' => (int) round($score / $total * 100),
        ] + $styles[$id];
    }
    usort($ranked, static function (array $a, array $b): int {
        $byScore = $b['score'] <=> $a['score'];
        if ($byScore !== 0) return $byScore;
        $byStrong = $b['strongMatches'] <=> $a['strongMatches'];
        if ($byStrong !== 0) return $byStrong;
        return strcmp($a['label'], $b['label']);
    });

    $primary = $ranked[0];
    $secondary = $ranked[1];
    $isBlend = $primary['score'] > 0 && ($secondary['score'] / $primary['score']) >= 0.82;
    $title = $isBlend
        ? $primary['label'] . ' mit ' . $secondary['label'] . '-Anteil'
        : $primary['label'];
    $description = $isBlend
        ? $primary['description'] . ' ' . $secondary['label'] . ' ergänzt Ihr Profil deutlich und sollte bei Material, Farbe und Details mitgedacht werden.'
        : $primary['description'];

    return [
        'title' => $title,
        'description' => $description,
        'ranked' => $ranked,
        'primary' => $primary['id'],
        'secondary' => $secondary['id'],
        'isBlend' => $isBlend,
    ];
}
