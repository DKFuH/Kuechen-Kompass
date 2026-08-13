<?php
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => !empty($_SERVER['HTTPS']),
]);
require dirname(__DIR__) . '/bootstrap.php';

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
foreach (['feeling', 'visual_language', 'palette', 'materials', 'handles'] as $requiredAnswer) {
    if (empty($answers[$requiredAnswer])) {
        json_response(['ok' => false, 'message' => 'Das Stilprofil ist unvollständig. Bitte prüfen Sie Ihre Antworten.'], 422);
    }
}
$result = calculate_result($answers);

$pdo = database();
$ipHash = client_ip_hash();
$rate = $pdo->prepare("SELECT COUNT(*) FROM submissions WHERE ip_hash = :ip AND created_at >= datetime('now', '-15 minutes')");
$rate->execute(['ip' => $ipHash]);
if ((int) $rate->fetchColumn() >= 5) {
    json_response(['ok' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'], 429);
}

$publicId = bin2hex(random_bytes(8));
$createdAt = gmdate('Y-m-d H:i:s');
$answeredCount = count(array_filter($answers, static fn (array $values): bool => $values !== []));
$project = [
    'callback' => filter_var($input['callback'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'completion' => (int) round($answeredCount / count(answer_schema()) * 100),
    'skipped' => normalize_skipped($input['skipped'] ?? [], $answers),
    'source' => clean_text($input['source'] ?? 'kuechen-kompass', 80),
];

$statement = $pdo->prepare(
    'INSERT INTO submissions (
        public_id, created_at, ip_hash, name, email, phone, postal_code, city,
        result_title, result_json, answers_json, details_json, project_json, consent_at
    ) VALUES (
        :public_id, :created_at, :ip_hash, :name, :email, :phone, :postal_code, :city,
        :result_title, :result_json, :answers_json, :details_json, :project_json, :consent_at
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
    'result_title' => clean_text($result['title'], 120),
    'result_json' => json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'answers_json' => json_encode($answers, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'details_json' => json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'project_json' => json_encode($project, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'consent_at' => $createdAt,
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

$config = app_config();
$mailStatus = send_notification($config, $payload);
$n8nStatus = send_to_n8n($pdo, $config, $publicId, $payload);
$deliveryPending = $mailStatus !== true && $n8nStatus !== true;
$deliveryErrors = [];
if ($mailStatus === false) {
    $deliveryErrors[] = 'PHP-Mail wurde nicht angenommen.';
}
if ($n8nStatus === false) {
    $deliveryErrors[] = 'n8n-Webhook wurde nicht angenommen.';
}
if ($mailStatus === null && $n8nStatus === null) {
    $deliveryErrors[] = 'Kein Zustellweg konfiguriert.';
}
$deliveryUpdate = $pdo->prepare('UPDATE submissions SET delivery_status = :status, delivery_error = :error WHERE public_id = :id');
$deliveryUpdate->execute([
    'status' => $deliveryPending ? 'pending' : 'sent',
    'error' => $deliveryErrors === [] ? null : implode(' ', $deliveryErrors),
    'id' => $publicId,
]);

json_response([
    'ok' => true,
    'submission_id' => $publicId,
    'delivery_pending' => $deliveryPending,
], $deliveryPending ? 202 : 201);

function send_notification(array $config, array $payload): ?bool
{
    if ($config['mail_to'] === '') {
        return null;
    }
    if (!filter_var($config['mail_to'], FILTER_VALIDATE_EMAIL) || !filter_var($config['mail_from'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $contact = $payload['contact'];
    $subject = 'Neues Küchenprofil: ' . clean_text($payload['result']['title'] ?? 'Unbekannt');
    $lines = [
        'Neues Küchenprofil',
        '',
        'ID: ' . $payload['submission_id'],
        'Name: ' . $contact['name'],
        'E-Mail: ' . $contact['email'],
        'Telefon: ' . ($contact['phone'] ?: '–'),
        'PLZ / Ort: ' . trim(($contact['postal_code'] ?: '–') . ' ' . ($contact['city'] ?: '')),
        'Stil: ' . ($payload['result']['title'] ?? '–'),
        'Profil vollständig: ' . ($payload['project']['completion'] ?? 0) . ' %',
        'Rückmeldung gewünscht: ' . (!empty($payload['project']['callback']) ? 'Ja' : 'Nein'),
    ];
    $roomDimensions = $payload['details']['room_dimensions'] ?? null;
    if (is_array($roomDimensions) && array_filter($roomDimensions)) {
        $parts = array_filter([$roomDimensions['length'] ?? null, $roomDimensions['width'] ?? null, $roomDimensions['height'] ?? null]);
        $lines[] = 'Raummaße (L×B×H): ' . implode(' × ', $parts) . ' cm';
    }
    $body = implode("\n", $lines);
    $headers = [
        'From: ' . $config['mail_from'],
        'Reply-To: ' . $contact['email'],
        'Content-Type: text/plain; charset=UTF-8',
    ];
    return @mail($config['mail_to'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}

function send_to_n8n(PDO $pdo, array $config, string $publicId, array $payload): ?bool
{
    if ($config['n8n_webhook_url'] === '') {
        return null;
    }
    if (!function_exists('curl_init')) {
        return false;
    }
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $headers = ['Content-Type: application/json'];
    if ($config['n8n_webhook_secret'] !== '') {
        $headers[] = 'X-Kuechen-Kompass-Signature: sha256=' . hash_hmac('sha256', $body, $config['n8n_webhook_secret']);
    }
    $curl = curl_init($config['n8n_webhook_url']);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 8,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    $ok = $response !== false && $status >= 200 && $status < 300;
    $update = $pdo->prepare('UPDATE submissions SET n8n_status = :status, n8n_error = :error WHERE public_id = :id');
    $update->execute([
        'status' => $ok ? 'sent' : 'failed',
        'error' => $ok ? null : mb_substr($error ?: 'HTTP ' . $status, 0, 500),
        'id' => $publicId,
    ]);
    return $ok;
}

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
        'appliances' => [['oven', 'steamer', 'hob', 'fridge', 'fridge_freezer', 'dishwasher', 'design_hood', 'microwave'], 8],
        'extractor_type' => [['exhaust', 'recirculation'], 1],
        'extractor_style' => [['cabinet', 'hood', 'hob_integrated', 'unsure'], 1],
        'waste_separation' => [['integrated', 'separate', 'open'], 1],
        'lighting' => [['niche', 'cabinet_light', 'drawer_light', 'plinth_light', 'ceiling_spots'], 5],
        'project_time' => [['0_3', '3_6', '6_12', 'ideas'], 1],
        'budget' => [['under_15', '15_25', '25_40', 'over_40', 'unknown'], 1],
        'special_wishes' => [['filled'], 1],
    ];
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
        'calm' => ['minimal' => 3, 'japandi' => 2], 'warm' => ['natural' => 3, 'classic' => 1],
        'bold' => ['urban' => 3, 'minimal' => 1], 'elegant' => ['classic' => 3, 'minimal' => 1],
        'flat' => ['minimal' => 3, 'urban' => 1], 'soft' => ['natural' => 3, 'japandi' => 2],
        'framed' => ['classic' => 3], 'architectural' => ['urban' => 3, 'minimal' => 2],
        'sand' => ['natural' => 2, 'japandi' => 2, 'minimal' => 1], 'light' => ['minimal' => 3],
        'earth' => ['natural' => 3, 'classic' => 1], 'dark' => ['urban' => 3, 'classic' => 1],
        'wood' => ['natural' => 3, 'japandi' => 2], 'stone' => ['minimal' => 2, 'urban' => 2],
        'lacquer' => ['minimal' => 3, 'classic' => 1], 'metal' => ['urban' => 3, 'classic' => 1],
        'glass' => ['classic' => 2, 'urban' => 1], 'handleless' => ['minimal' => 3, 'japandi' => 1],
        'edge' => ['minimal' => 2, 'urban' => 1], 'handle' => ['classic' => 3, 'natural' => 1],
    ];
    $scores = array_fill_keys(array_keys($styles), 0);
    foreach ($answers as $values) {
        foreach ($values as $answer) {
            foreach ($weights[$answer] ?? [] as $style => $points) {
                $scores[$style] += $points;
            }
        }
    }
    $total = max(1, array_sum($scores));
    $ranked = [];
    foreach ($scores as $id => $score) {
        $ranked[] = ['id' => $id, 'score' => $score, 'percent' => (int) round($score / $total * 100)] + $styles[$id];
    }
    usort($ranked, static fn (array $a, array $b): int => $b['score'] <=> $a['score']);
    return [
        'title' => $ranked[0]['label'],
        'description' => $ranked[0]['description'],
        'ranked' => $ranked,
        'primary' => $ranked[0]['id'],
    ];
}
