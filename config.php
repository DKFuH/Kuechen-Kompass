<?php
declare(strict_types=1);

return [
    'app_name' => 'Küchen-Stilfinder',
    'mail_to' => getenv('MAIL_TO') ?: '',
    'mail_from' => getenv('MAIL_FROM') ?: 'stilfinder@localhost',
    'n8n_webhook_url' => getenv('N8N_WEBHOOK_URL') ?: '',
    'n8n_webhook_secret' => getenv('N8N_WEBHOOK_SECRET') ?: '',
    'database' => __DIR__ . '/storage/kuechen-kompass.sqlite',
    'smtp_host' => getenv('SMTP_HOST') ?: '',
    'smtp_port' => (int)(getenv('SMTP_PORT') ?: 587),
    'smtp_username' => getenv('SMTP_USERNAME') ?: '',
    'smtp_password' => getenv('SMTP_PASSWORD') ?: '',
    'smtp_encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls',
    'smtp_from_email' => getenv('SMTP_FROM_EMAIL') ?: 'stilfinder@kuechen-klas.de',
    'smtp_from_name' => getenv('SMTP_FROM_NAME') ?: 'Klas Küchen Stilfinder',
];
