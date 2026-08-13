<?php
declare(strict_types=1);

return [
    'app_name' => 'Küchen-Kompass',
    'mail_to' => getenv('MAIL_TO') ?: '',
    'mail_from' => getenv('MAIL_FROM') ?: 'stilfinder@localhost',
    'n8n_webhook_url' => getenv('N8N_WEBHOOK_URL') ?: '',
    'n8n_webhook_secret' => getenv('N8N_WEBHOOK_SECRET') ?: '',
    'database' => __DIR__ . '/storage/kuechen-kompass.sqlite',
];

