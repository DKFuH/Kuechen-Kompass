<?php
declare(strict_types=1);

function app_config(): array
{
    static $config;
    load_environment(__DIR__ . '/.env');
    return $config ??= require __DIR__ . '/config.php';
}

function load_environment(string $path): void
{
    static $loaded = false;
    if ($loaded || !is_file($path) || !is_readable($path)) {
        return;
    }
    $loaded = true;
    $values = parse_ini_file($path, false, INI_SCANNER_RAW);
    if (!is_array($values)) {
        return;
    }
    foreach ($values as $name => $value) {
        if (!is_string($name) || !preg_match('/^[A-Z][A-Z0-9_]*$/', $name) || getenv($name) !== false) {
            continue;
        }
        $value = (string) $value;
        putenv($name . '=' . $value);
        $_ENV[$name] = $value;
    }
}

function database(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = app_config();
    $directory = dirname($config['database']);
    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    $pdo = new PDO('sqlite:' . $config['database'], null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            public_id TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            postal_code TEXT,
            city TEXT,
            result_title TEXT NOT NULL,
            result_json TEXT NOT NULL,
            answers_json TEXT NOT NULL,
            details_json TEXT NOT NULL DEFAULT "{}",
            project_json TEXT NOT NULL,
            consent_at TEXT NOT NULL,
            delivery_status TEXT NOT NULL DEFAULT "pending",
            delivery_error TEXT,
            n8n_status TEXT NOT NULL DEFAULT "pending",
            n8n_error TEXT
        )'
    );
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email)');
    $columns = array_column($pdo->query('PRAGMA table_info(submissions)')->fetchAll(), 'name');
    foreach ([
        'details_json' => 'ALTER TABLE submissions ADD COLUMN details_json TEXT NOT NULL DEFAULT "{}"',
        'city' => 'ALTER TABLE submissions ADD COLUMN city TEXT',
        'delivery_status' => 'ALTER TABLE submissions ADD COLUMN delivery_status TEXT NOT NULL DEFAULT "pending"',
        'delivery_error' => 'ALTER TABLE submissions ADD COLUMN delivery_error TEXT',
    ] as $column => $migration) {
        if (!in_array($column, $columns, true)) {
            $pdo->exec($migration);
        }
    }

    return $pdo;
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_text(mixed $value, int $maxLength = 200): string
{
    $value = trim((string) $value);
    return mb_substr(preg_replace('/\s+/u', ' ', $value) ?? '', 0, $maxLength);
}

function client_ip_hash(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return hash('sha256', $ip . '|kuechen-kompass-v1');
}
