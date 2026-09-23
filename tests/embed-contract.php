<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$failures = [];
$check = static function (bool $condition, string $message) use (&$failures): void {
    if (!$condition) $failures[] = $message;
};

$embed = (string) file_get_contents($root . '/assets/embed.js');
$app = (string) file_get_contents($root . '/assets/app.js');
$submit = (string) file_get_contents($root . '/api/submit.php');
$css = (string) file_get_contents($root . '/assets/app.css');

$check(str_contains($embed, "kuechen-kompass:event"), 'Embed bridge does not forward funnel events.');
$check(str_contains($embed, "'utm_source'"), 'Embed bridge does not pass campaign context.');
$check(str_contains($app, "reportEmbedEvent('start'"), 'Start event is missing.');
$check(str_contains($app, "reportEmbedEvent('style_result'"), 'Style result event is missing.');
$check(str_contains($app, "reportEmbedEvent('project_questions_start'"), 'Planning start event is missing.');
$check(str_contains($app, "reportEmbedEvent('lead'"), 'Successful lead event is missing.');
$check(str_contains($app, 'campaign: state.campaign'), 'Campaign context is not included in the lead payload.');
$check(str_contains($submit, "'campaign' => normalize_campaign"), 'Server does not normalize campaign context.');
$check(str_contains($css, '.embed-mode .intro-visual { display: none; }'), 'Mobile embed does not prioritize the start action.');
$index = (string) file_get_contents($root . '/index.php');
$check(str_contains($index, 'Optionale Analyse nur mit Ihrer Einwilligung'), 'Embedded privacy copy does not match parent-side tracking.');

if ($failures !== []) {
    fwrite(STDERR, implode(PHP_EOL, $failures) . PHP_EOL);
    exit(1);
}

echo "Embed contract tests passed.\n";
