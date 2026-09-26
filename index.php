<?php
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => !empty($_SERVER['HTTPS']),
]);

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
}

$assetVersion = static function (string $path): string {
    return (string) (@filemtime(__DIR__ . '/' . $path) ?: time());
};
$stilfinderCsrfToken = (string) $_SESSION['csrf_token'];
$stilfinderAssetBase = './module/';
$stilfinderInline = ($_GET['embed'] ?? '') === '1';
?>
<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Entdecken Sie Ihren Küchenstil und erstellen Sie Schritt für Schritt Ihr persönliches Planungsprofil.">
    <meta name="theme-color" content="#8c6a4f">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>Küchen-Kompass | Klas Küchen</title>
    <link rel="stylesheet" href="module/assets/app.css?v=<?= rawurlencode($assetVersion('module/assets/app.css')) ?>">
    <style>html,body{margin:0;background:#fbfaf7}</style>
</head>
<body>
<?php require __DIR__ . '/module/view.php'; ?>
<script src="module/assets/image-loader.js?v=<?= rawurlencode($assetVersion('module/assets/image-loader.js')) ?>" defer></script>
<script src="module/assets/app.js?v=<?= rawurlencode($assetVersion('module/assets/app.js')) ?>" defer></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    window.KuechenStilfinder.mount(document.querySelector('[data-kuechen-stilfinder]'), {
        submitUrl: '/api/submit.php',
        csrfToken: <?= json_encode($stilfinderCsrfToken, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>,
        assetBase: '/module/',
        source: 'kuechen-kompass'
    });
}, { once: true });
</script>
</body>
</html>
