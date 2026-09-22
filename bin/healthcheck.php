<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';

$checks = [];
$checks['PHP >= 8.1'] = version_compare(PHP_VERSION, '8.1.0', '>=');
$checks['pdo_sqlite'] = extension_loaded('pdo_sqlite');
$checks['mbstring'] = extension_loaded('mbstring');
$checks['storage beschreibbar'] = is_writable(dirname(app_config()['database']));
$checks['Zustellweg konfiguriert'] = app_config()['mail_to'] !== '' || app_config()['n8n_webhook_url'] !== '';
$checks['SMTP oder n8n empfohlen'] = app_config()['smtp_host'] !== '' || app_config()['n8n_webhook_url'] !== '';

$pdo = database();
$agedPending = (int) $pdo->query(
    "SELECT COUNT(*) FROM submissions
     WHERE delivery_status = 'pending'
       AND created_at <= datetime('now', '-15 minutes')"
)->fetchColumn();
$checks['Keine >15 Min. alten Pending-Leads'] = $agedPending === 0;

$failed = false;
foreach ($checks as $label => $ok) {
    fwrite(STDOUT, sprintf("[%s] %s\n", $ok ? 'OK' : 'FEHLER', $label));
    if (!$ok) {
        $failed = true;
    }
}
if ($agedPending > 0) {
    fwrite(STDOUT, "Offene Pending-Leads älter als 15 Minuten: {$agedPending}\n");
}

$latest = $pdo->query(
    "SELECT delivery_status, delivery_error, last_attempt_at
     FROM submissions
     ORDER BY id DESC
     LIMIT 1"
)->fetch();
if (is_array($latest)) {
    fwrite(STDOUT, "Letzter Lead: {$latest['delivery_status']}" . ($latest['last_attempt_at'] ? " / Versuch {$latest['last_attempt_at']} UTC" : '') . "\n");
    if (!empty($latest['delivery_error'])) {
        fwrite(STDOUT, "Letzter Zustellfehler: {$latest['delivery_error']}\n");
    }
}

exit($failed ? 1 : 0);
