<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$failures = [];
$check = static function (bool $condition, string $message) use (&$failures): void {
    if (!$condition) $failures[] = $message;
};

$embed = (string) file_get_contents($root . '/assets/embed.js');
$app = (string) file_get_contents($root . '/assets/app.js');
$analytics = (string) file_get_contents($root . '/assets/analytics.js');
$imageLoader = (string) file_get_contents($root . '/assets/image-loader.js');
$submit = (string) file_get_contents($root . '/api/submit.php');
$css = (string) file_get_contents($root . '/assets/app.css');
$htaccess = (string) file_get_contents($root . '/.htaccess');

$check(str_contains($embed, "kuechen-kompass:event"), 'Embed bridge does not forward funnel events.');
$check(str_contains($embed, "'utm_source'"), 'Embed bridge does not pass campaign context.');
$check(str_contains($embed, 'dataset.analyticsProfile'), 'Embed bridge does not accept an analytics profile slug.');
$check(str_contains($embed, "acceptedProviders.includes('matomo')"), 'Embed bridge does not derive analytics permission from Matomo consent.');
$check(str_contains($embed, 'let iframeReady = false;'), 'Embed bridge does not track whether the iframe is ready for postMessage.');
$check(str_contains($embed, 'if (!iframeReady || !iframe.contentWindow) return;'), 'Embed bridge may post context before the iframe reaches its target origin.');
$loadHandlerPosition = strpos($embed, "iframe.addEventListener('load'");
$iframeInsertionPosition = strpos($embed, 'container.replaceChildren(iframe)');
$check(
    $loadHandlerPosition !== false
        && $iframeInsertionPosition !== false
        && $loadHandlerPosition < $iframeInsertionPosition,
    'Embed bridge inserts the iframe before registering its load handler.'
);
$check(str_contains($analytics, "containerId: '1ZzpGfcK'"), 'Stilfinder analytics profile is not mapped to the Matomo Tag Manager container.');
$check(str_contains($analytics, "baseUrl: 'https://analytics.kuechen-klas.de/'"), 'Matomo base URL is missing from the allowlisted profile.');
$check(!str_contains($analytics, "['disableCookies']"), 'Embedded MTM tracker must use the container cookie configuration.');
$check(str_contains($analytics, "event: 'klas.consent_ready'"), 'Embedded MTM container is not consent-gated.');
$check(str_contains($analytics, "consent_providers: 'matomo'"), 'Embedded MTM container may receive consent for unrelated providers.');
$check(str_contains($analytics, "event: 'mtm.Start'"), 'Embedded MTM container is not started.');
$check(str_contains($analytics, 'container_${encodeURIComponent(config.containerId)}.js'), 'Embedded MTM container script is not loaded safely.');
$check(!str_contains($analytics, 'matomo.js'), 'Embedded tracker must be provided by MTM instead of loading matomo.js directly.');
$check(!str_contains($analytics, "['setTrackerUrl'"), 'Embedded tracker still configures Matomo directly.');
$check(!str_contains($analytics, "['setSiteId'"), 'Embedded tracker still assigns a Matomo site directly.');
$check(!str_contains($analytics, "['trackPageView'"), 'Embedded tracker still sends a direct Matomo page view.');
$check(str_contains($analytics, 'HeatmapSessionRecording::enable'), 'Heatmap recording is not enabled after consent.');
$check(str_contains($analytics, 'HeatmapSessionRecording::disable'), 'Heatmap recording is not disabled after consent withdrawal.');
$check(str_contains($analytics, 'mtmConsentGranted'), 'Embedded MTM loader does not deduplicate repeated consent context.');
$check(str_contains($analytics, 'kuechen-kompass:analytics-status'), 'Embedded tracker does not report its status to the parent.');
$check(str_contains($index = (string) file_get_contents($root . '/index.php'), 'assets/image-loader.js'), 'Resilient image loader is not included.');
$check(str_contains($app, 'KuechenKompassImages.load'), 'Dynamic option and result images do not use the resilient loader.');
$check(str_contains($css, '.answer-card.has-image .answer-swatch'), 'Image fallback must reserve the final card height while loading.');
$check(str_contains($imageLoader, "searchParams.set('kk_retry'"), 'Image retries do not bypass a cached transient failure.');
$check(str_contains($htaccess, "script-src 'self' https://analytics.kuechen-klas.de"), 'CSP blocks the consent-gated Matomo tracker script.');
$check(str_contains($htaccess, "connect-src 'self' https://analytics.kuechen-klas.de"), 'CSP blocks Matomo tracking and heatmap requests.');
$check(str_contains($htaccess, "img-src 'self' data: https://analytics.kuechen-klas.de"), 'CSP blocks the Matomo tracking image fallback.');
$check(str_contains($app, "reportEmbedEvent('start'"), 'Start event is missing.');
$check(str_contains($app, "reportEmbedEvent('style_result'"), 'Style result event is missing.');
$check(str_contains($app, "reportEmbedEvent('project_questions_start'"), 'Planning start event is missing.');
$check(str_contains($app, "reportEmbedEvent('lead'"), 'Successful lead event is missing.');
$check(str_contains($app, 'event_id: body.submission_id'), 'Successful lead does not expose the stable submission ID to the parent tracking bridge.');
$check(str_contains($app, 'campaign: state.campaign'), 'Campaign context is not included in the lead payload.');
$check(str_contains($submit, "'campaign' => normalize_campaign"), 'Server does not normalize campaign context.');
$check(str_contains($css, '.embed-mode .intro-visual { display: none; }'), 'Mobile embed does not prioritize the start action.');
$check(!str_contains($index, 'Optionale Analyse nur mit Ihrer Einwilligung'), 'Embedded intro must not advertise optional analytics.');
$check(!str_contains($index, 'intro-visual-badge'), 'Hero must not contain an AI label overlay.');
$check(!str_contains($index, 'class="compass"'), 'Hero must not contain the compass overlay.');

$shapeAssets = [
    'single_row' => 'shape-single-row.webp',
    'double_row' => 'shape-double-row.webp',
    'u_shape' => 'shape-u-form.webp',
    'l_shape' => 'shape-l-form.webp',
    'island' => 'shape-island.webp',
    'unknown' => 'shape-unknown.webp',
];
foreach ($shapeAssets as $option => $filename) {
    $relativePath = 'assets/images/' . $filename;
    $check(is_file($root . '/' . $relativePath), 'Missing kitchen-shape image: ' . $relativePath);
    $check(
        str_contains($app, $option . ": '" . $relativePath . "'"),
        'Kitchen-shape option is not mapped to its image: ' . $option
    );
}

if ($failures !== []) {
    fwrite(STDERR, implode(PHP_EOL, $failures) . PHP_EOL);
    exit(1);
}

echo "Embed contract tests passed.\n";
