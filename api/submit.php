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
$answers = is_array($input['answers'] ?? null) ? $input['answers'] : [];
$details = is_array($input['details'] ?? null) ? $input['details'] : [];
$result = is_array($input['result'] ?? null) ? $input['result'] : [];

if ($name === '' || !$email || !$consent || empty($result['title'])) {
    json_response(['ok' => false, 'message' => 'Bitte prüfen Sie Name, E-Mail-Adresse und Einwilligung.'], 422);
}
if (count($answers) > 30 || strlen(json_encode($answers)) > 30000 || strlen(json_encode($details)) > 5000) {
    json_response(['ok' => false, 'message' => 'Die Anfrage ist zu umfangreich.'], 413);
}

$pdo = database();
$ipHash = client_ip_hash();
$rate = $pdo->prepare("SELECT COUNT(*) FROM submissions WHERE ip_hash = :ip AND created_at >= datetime('now', '-15 minutes')");
$rate->execute(['ip' => $ipHash]);
if ((int) $rate->fetchColumn() >= 5) {
    json_response(['ok' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'], 429);
}

$publicId = bin2hex(random_bytes(8));
$createdAt = gmdate('Y-m-d H:i:s');
$project = [
    'callback' => filter_var($input['callback'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'completion' => max(0, min(100, (int) ($input['completion'] ?? 0))),
    'skipped' => array_values(array_filter((array) ($input['skipped'] ?? []), 'is_string')),
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
send_notification($config, $payload);
send_to_n8n($pdo, $config, $publicId, $payload);

json_response(['ok' => true, 'submission_id' => $publicId], 201);

function send_notification(array $config, array $payload): void
{
    if ($config['mail_to'] === '') {
        return;
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
    @mail($config['mail_to'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}

function send_to_n8n(PDO $pdo, array $config, string $publicId, array $payload): void
{
    if ($config['n8n_webhook_url'] === '' || !function_exists('curl_init')) {
        return;
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
}

