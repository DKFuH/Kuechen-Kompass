<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';
require dirname(__DIR__) . '/delivery.php';

$pdo = database();
prune_submissions($pdo);

$stmt = $pdo->query(
    "SELECT * FROM submissions
     WHERE delivery_status = 'pending'
       AND (next_retry_at IS NULL OR next_retry_at <= datetime('now'))
     ORDER BY created_at ASC
     LIMIT 25"
);
$rows = $stmt->fetchAll();

if ($rows === []) {
    fwrite(STDOUT, "Keine fälligen Zustellungen.\n");
    exit(0);
}

$config = app_config();
$failed = 0;
foreach ($rows as $row) {
    $payload = [
        'event' => 'kuechen_kompass.submitted',
        'submission_id' => $row['public_id'],
        'created_at' => $row['created_at'] . 'Z',
        'contact' => [
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'] ?? '',
            'postal_code' => $row['postal_code'] ?? '',
            'city' => $row['city'] ?? '',
        ],
        'result' => json_decode((string) $row['result_json'], true) ?: [],
        'answers' => json_decode((string) $row['answers_json'], true) ?: [],
        'details' => json_decode((string) $row['details_json'], true) ?: [],
        'project' => json_decode((string) $row['project_json'], true) ?: [],
    ];

    $result = attempt_delivery($pdo, $config, (string) $row['public_id'], $payload);
    fwrite(STDOUT, sprintf(
        "%s: %s (Versuch %d)%s\n",
        $row['public_id'],
        $result['status'],
        $result['attempts'],
        $result['next_retry_at'] ? ', nächster Versuch ' . $result['next_retry_at'] . ' UTC' : ''
    ));
    if ($result['status'] === 'failed') {
        $failed++;
    }
}

exit($failed > 0 ? 2 : 0);
