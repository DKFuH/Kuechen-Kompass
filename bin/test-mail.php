<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';
require dirname(__DIR__) . '/delivery.php';

$config = app_config();

fwrite(STDOUT, "Küchen-Kompass Mailtest\n");
fwrite(STDOUT, "MAIL_TO: " . ($config['mail_to'] !== '' ? $config['mail_to'] : '[leer]') . "\n");
fwrite(STDOUT, "Versandweg: " . ($config['smtp_host'] !== '' ? 'SMTP' : 'PHP mail()') . "\n");
if ($config['smtp_host'] !== '') {
    fwrite(STDOUT, "SMTP: {$config['smtp_host']}:{$config['smtp_port']} / {$config['smtp_encryption']}\n");
    fwrite(STDOUT, "SMTP Benutzer: " . ($config['smtp_username'] !== '' ? $config['smtp_username'] : '[leer]') . "\n");
    fwrite(STDOUT, "Absender: {$config['smtp_from_email']}\n");
}

$payload = [
    'submission_id' => 'mailtest-' . gmdate('Ymd-His'),
    'contact' => [
        'name' => 'Küchen-Kompass Mailtest',
        'email' => $config['mail_to'] !== '' ? $config['mail_to'] : 'noreply@example.invalid',
        'phone' => '',
        'postal_code' => '',
        'city' => '',
    ],
    'result' => ['title' => 'SMTP-Test'],
    'details' => [],
    'project' => ['completion' => 100, 'callback' => false, 'visitor_id' => ''],
];

$error = null;
$status = send_notification($config, $payload, $error);

if ($status === true) {
    fwrite(STDOUT, "[OK] Testmail wurde vom Versandweg angenommen.\n");
    exit(0);
}
if ($status === null) {
    fwrite(STDERR, "[FEHLER] Kein E-Mail-Zustellweg aktiv: MAIL_TO ist leer.\n");
    exit(2);
}

fwrite(STDERR, "[FEHLER] Mailversand fehlgeschlagen: " . ($error ?: 'unbekannter Fehler') . "\n");
exit(1);
