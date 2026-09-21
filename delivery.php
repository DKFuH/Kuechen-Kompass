<?php
declare(strict_types=1);

function attempt_delivery(PDO $pdo, array $config, string $publicId, array $payload): array
{
    $stmt = $pdo->prepare('SELECT delivery_attempts FROM submissions WHERE public_id = :id');
    $stmt->execute(['id' => $publicId]);
    $attempts = (int) ($stmt->fetchColumn() ?: 0) + 1;

    $mailStatus = send_notification($config, $payload);
    $n8n = send_to_n8n($config, $payload);
    $n8nStatus = $n8n['status'];

    $delivered = $mailStatus === true || $n8nStatus === true;
    $hasRoute = $mailStatus !== null || $n8nStatus !== null;
    $errors = [];

    if ($mailStatus === false) {
        $errors[] = 'E-Mail-Benachrichtigung wurde nicht angenommen.';
    }
    if ($n8nStatus === false) {
        $errors[] = 'n8n-Webhook fehlgeschlagen' . ($n8n['error'] ? ': ' . $n8n['error'] : '.');
    }
    if (!$hasRoute) {
        $errors[] = 'Kein Zustellweg konfiguriert.';
    }

    $maxAttempts = 8;
    $deliveryStatus = $delivered ? 'sent' : ($attempts >= $maxAttempts ? 'failed' : 'pending');
    $nextRetryAt = null;
    if ($deliveryStatus === 'pending') {
        $delays = [5, 15, 60, 180, 720, 1440, 2880];
        $delayMinutes = $delays[min($attempts - 1, count($delays) - 1)];
        $nextRetryAt = gmdate('Y-m-d H:i:s', time() + ($delayMinutes * 60));
    }

    $update = $pdo->prepare(
        'UPDATE submissions
         SET delivery_status = :delivery_status,
             delivery_error = :delivery_error,
             delivery_attempts = :delivery_attempts,
             last_attempt_at = :last_attempt_at,
             next_retry_at = :next_retry_at,
             n8n_status = :n8n_status,
             n8n_error = :n8n_error
         WHERE public_id = :id'
    );
    $update->execute([
        'delivery_status' => $deliveryStatus,
        'delivery_error' => $errors === [] ? null : mb_substr(implode(' ', $errors), 0, 1000),
        'delivery_attempts' => $attempts,
        'last_attempt_at' => gmdate('Y-m-d H:i:s'),
        'next_retry_at' => $nextRetryAt,
        'n8n_status' => $n8nStatus === null ? 'disabled' : ($n8nStatus ? 'sent' : 'failed'),
        'n8n_error' => $n8n['error'],
        'id' => $publicId,
    ]);

    return [
        'delivered' => $delivered,
        'pending' => $deliveryStatus === 'pending',
        'status' => $deliveryStatus,
        'attempts' => $attempts,
        'next_retry_at' => $nextRetryAt,
    ];
}

function send_notification(array $config, array $payload): ?bool
{
    if ($config['mail_to'] === '') {
        return null;
    }
    if (!filter_var($config['mail_to'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    if ($config['smtp_host'] !== '' && !filter_var($config['smtp_from_email'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    if ($config['smtp_host'] === '' && !filter_var($config['mail_from'], FILTER_VALIDATE_EMAIL)) {
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
        'Planungsfragen beantwortet: ' . ($payload['project']['completion'] ?? 0) . ' %',
        'Rückmeldung gewünscht: ' . (!empty($payload['project']['callback']) ? 'Ja' : 'Nein'),
        'Visitor-ID: ' . (($payload['project']['visitor_id'] ?? '') ?: '–'),
    ];

    $roomDimensions = $payload['details']['room_dimensions'] ?? null;
    if (is_array($roomDimensions) && array_filter($roomDimensions)) {
        $parts = array_filter([$roomDimensions['length'] ?? null, $roomDimensions['width'] ?? null, $roomDimensions['height'] ?? null]);
        $lines[] = 'Raummaße (L×B×H): ' . implode(' × ', $parts) . ' cm';
    }
    $body = implode("\n", $lines);

    if ($config['smtp_host'] !== '') {
        return send_via_smtp($config, $contact['email'], $subject, $body);
    }

    $headers = [
        'From: ' . $config['mail_from'],
        'Reply-To: ' . $contact['email'],
        'Content-Type: text/plain; charset=UTF-8',
    ];
    return @mail($config['mail_to'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}

function send_via_smtp(array $config, string $replyTo, string $subject, string $body): bool
{
    require_once __DIR__ . '/lib/phpmailer/Exception.php';
    require_once __DIR__ . '/lib/phpmailer/SMTP.php';
    require_once __DIR__ . '/lib/phpmailer/PHPMailer.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->Port = $config['smtp_port'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = strtolower($config['smtp_encryption']) === 'ssl'
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($config['smtp_from_email'], $config['smtp_from_name']);
        $mail->addAddress($config['mail_to']);
        if ($replyTo !== '') {
            $mail->addReplyTo($replyTo);
        }
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->send();
        return true;
    } catch (\Throwable) {
        return false;
    }
}

/** @return array{status:?bool,error:?string} */
function send_to_n8n(array $config, array $payload): array
{
    if ($config['n8n_webhook_url'] === '') {
        return ['status' => null, 'error' => null];
    }
    if (!function_exists('curl_init')) {
        return ['status' => false, 'error' => 'PHP-cURL ist nicht verfügbar.'];
    }

    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($body)) {
        return ['status' => false, 'error' => 'Payload konnte nicht serialisiert werden.'];
    }

    $headers = [
        'Content-Type: application/json',
        'Idempotency-Key: kuechen-kompass-' . clean_text($payload['submission_id'] ?? '', 80),
    ];
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
    return [
        'status' => $ok,
        'error' => $ok ? null : mb_substr($error ?: 'HTTP ' . $status, 0, 500),
    ];
}
