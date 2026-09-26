<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit(1);
}

$arguments = array_values(array_slice($argv, 1));
$checkOnly = in_array('--check', $arguments, true);
$arguments = array_values(array_filter($arguments, static fn (string $value): bool => $value !== '--check'));
if (count($arguments) !== 1) {
    fwrite(STDERR, "Aufruf: php bin/sync-main-site.php <hauptwebsite-repository> [--check]\n");
    exit(64);
}

$sourceRoot = realpath(dirname(__DIR__) . '/module');
$targetRoot = realpath($arguments[0]);
if ($sourceRoot === false || $targetRoot === false) {
    fwrite(STDERR, "Quell- oder Zielpfad existiert nicht.\n");
    exit(66);
}
if (!is_file($targetRoot . '/public/lp/stilfinder/index.php') || !is_dir($targetRoot . '/app')) {
    fwrite(STDERR, "Das Ziel ist kein erwartetes kuechen-klas.de-2026-Repository.\n");
    exit(65);
}

$destinationRoot = $targetRoot . '/public/lp/stilfinder/tool';
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($sourceRoot, FilesystemIterator::SKIP_DOTS)
);
$files = [];
foreach ($iterator as $file) {
    if (!$file->isFile() || $file->getFilename() === 'module-manifest.json') continue;
    $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($sourceRoot) + 1));
    $files[$relative] = hash_file('sha256', $file->getPathname());
}
ksort($files);

$manifestPath = $destinationRoot . '/module-manifest.json';
if ($checkOnly) {
    $manifest = is_file($manifestPath)
        ? json_decode((string) file_get_contents($manifestPath), true)
        : null;
    $targetHashes = is_array($manifest['files'] ?? null) ? $manifest['files'] : [];
    $failures = [];
    foreach ($files as $relative => $hash) {
        $target = $destinationRoot . '/' . $relative;
        if (!is_file($target)) {
            $failures[] = $relative . ': fehlt im Ziel';
            continue;
        }
        if (!hash_equals($hash, (string) hash_file('sha256', $target))) {
            $failures[] = $relative . ': Inhalt weicht ab';
        }
        if (($targetHashes[$relative] ?? '') !== $hash) {
            $failures[] = $relative . ': Manifest weicht ab';
        }
    }
    foreach (array_diff(array_keys($targetHashes), array_keys($files)) as $stale) {
        $failures[] = $stale . ': veralteter Manifest-Eintrag';
    }
    if ($failures !== []) {
        fwrite(STDERR, implode(PHP_EOL, array_unique($failures)) . PHP_EOL);
        exit(1);
    }
    fwrite(STDOUT, "Stilfinder-Modul ist synchron.\n");
    exit(0);
}

foreach ($files as $relative => $hash) {
    $source = $sourceRoot . '/' . $relative;
    $target = $destinationRoot . '/' . $relative;
    $directory = dirname($target);
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Zielverzeichnis konnte nicht erstellt werden: ' . $directory);
    }
    if (!copy($source, $target)) {
        throw new RuntimeException('Datei konnte nicht synchronisiert werden: ' . $relative);
    }
}

$manifest = [
    'schema' => 1,
    'source' => 'kuechen-kompass/module',
    'generated_at_utc' => gmdate('c'),
    'files' => $files,
];
if (!is_dir($destinationRoot) && !mkdir($destinationRoot, 0775, true) && !is_dir($destinationRoot)) {
    throw new RuntimeException('Zielverzeichnis konnte nicht erstellt werden.');
}
file_put_contents(
    $manifestPath,
    json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL,
    LOCK_EX
);
fwrite(STDOUT, sprintf("%d Moduldateien synchronisiert.\n", count($files)));
