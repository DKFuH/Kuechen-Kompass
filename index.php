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
$embedMode = ($_GET['embed'] ?? '') === '1';
$assetVersion = static function (string $path): string {
    $file = __DIR__ . '/' . $path;
    return (string) (@filemtime($file) ?: time());
};
?>
<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Entdecken Sie Ihren Küchenstil und erstellen Sie Schritt für Schritt Ihr persönliches Planungsprofil.">
    <meta name="theme-color" content="#8c6a4f">
    <meta name="csrf-token" content="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES) ?>">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>Küchen-Kompass | Klas Küchen</title>
    <link rel="stylesheet" href="assets/app.css?v=<?= $assetVersion('assets/app.css') ?>">
</head>
<body<?= $embedMode ? ' class="embed-mode"' : '' ?>>
<div class="app-shell">
    <header class="topbar">
        <a class="brand" href="/" aria-label="Küchen-Kompass Startseite">
            <span class="brand-mark">K</span>
            <span><strong>Küchen-Kompass</strong><small>von Klas Küchen</small></span>
        </a>
        <button class="quiet-button" id="restartButton" type="button">Neu starten</button>
    </header>

    <nav class="journey" id="journey" aria-label="Ihre Küchenreise"></nav>

    <main id="app" class="main" aria-live="polite">
        <section class="intro panel" data-view="intro">
            <div class="intro-copy">
                <span class="eyebrow">Ihre Küche beginnt mit einem Gefühl</span>
                <h1>Finden Sie heraus, welche Küche <em>wirklich</em> zu Ihnen passt.</h1>
                <p>Entdecken Sie zuerst Ihre persönliche Stilwelt. Danach können Sie Raum, Alltag und Wünsche ergänzen – in Ihrem Tempo und jederzeit änderbar.</p>
                <div class="intro-actions">
                    <button class="primary-button" id="startButton" type="button">Stilprofil starten</button>
                    <span>ca. 3 Minuten bis zu Ihrem Stilprofil</span>
                </div>
                <ul class="trust-list">
                    <li>Keine starren Stil-Schubladen</li>
                    <li>Zwischenergebnis ohne Kontaktdaten</li>
                    <?php if (!$embedMode): ?>
                        <li>Keine Analyse- oder Marketingdienste</li>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="intro-visual" aria-hidden="true">
                <img src="assets/images/hero-kitchen.webp?v=<?= $assetVersion('assets/images/hero-kitchen.webp') ?>" alt="" width="1000" height="1000" fetchpriority="high">
            </div>
        </section>

        <section class="quiz panel hidden" data-view="quiz">
            <div class="question-meta">
                <button class="back-arrow" id="backButtonTop" type="button" aria-label="Zurück zur vorherigen Frage">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span id="sectionLabel" class="eyebrow"></span>
                <span id="questionCounter"></span>
            </div>
            <h2 id="questionTitle" tabindex="-1"></h2>
            <span id="multipleHint" class="multiple-hint hidden">Mehrfachauswahl möglich</span>
            <p id="questionHelp" class="question-help"></p>
            <p id="selectionMessage" class="selection-message" role="status" aria-live="polite"></p>
            <div id="answers" class="answer-grid"></div>
            <div class="quiz-footer">
                <button class="text-button" id="skipButton" type="button">Später beantworten</button>
                <button class="primary-button" id="nextButton" type="button">Weiter</button>
            </div>
        </section>

        <section class="result panel hidden" data-view="result">
            <div class="result-header">
                <div>
                    <span class="eyebrow">Ihre persönliche Stilwelt</span>
                    <h2 id="resultTitle"></h2>
                    <p id="resultDescription"></p>
                </div>
                <div class="result-seal"><strong id="profileProgress">0%</strong><span>Profil</span></div>
            </div>
            <div id="resultImage" class="result-image" role="img"></div>
            <div class="style-mix-heading"><strong>Ihre Stilanteile</strong><span>Orientierungswerte aus Ihren Antworten – keine Messwerte.</span></div>
            <div id="styleBars" class="style-bars"></div>
            <section class="result-guidance" aria-label="Konkrete Stilhinweise">
                <div>
                    <span class="eyebrow">So wird der Stil stimmig</span>
                    <ul id="resultPrinciples"></ul>
                </div>
                <aside>
                    <span class="eyebrow">Darauf achten</span>
                    <p id="resultWatchout"></p>
                </aside>
            </section>
            <div class="result-layout">
                <div>
                    <h3>Ihre Material- und Farbwelt</h3>
                    <div id="moodboard" class="moodboard"></div>
                </div>
                <aside class="insight-card">
                    <span class="eyebrow">Planungshinweis</span>
                    <p id="resultInsight"></p>
                </aside>
            </div>
            <div id="planningSummary" class="planning-summary hidden">
                <h3>Ihre Planungsangaben</h3>
                <div id="planningGrid" class="planning-grid"></div>
            </div>
            <section class="decision-card">
                <div class="decision-card__intro">
                    <span class="eyebrow">Wie möchten Sie weitermachen?</span>
                    <h3><span id="decisionProgress">0%</span> der Planungsfragen sind beantwortet</h3>
                </div>
                <div class="decision-card__paths">
                    <div class="decision-path decision-path--continue" id="decisionPathContinue">
                        <h4>Planungsprofil ergänzen</h4>
                        <p>Ergänzen Sie noch offene Punkte zu Raum, Alltag und Technik. Übersprungene Fragen können Sie jederzeit über die Navigation wieder öffnen.</p>
                        <button class="primary-button" id="continuePlanningButton" type="button">Weiter planen</button>
                    </div>
                    <div class="decision-path decision-path--submit">
                        <h4>Persönliche Beratung anfragen</h4>
                        <p>Ihr aktuelles Profil reicht für den Einstieg aus. Daniel Klas meldet sich persönlich bei Ihnen und klärt die nächsten Schritte.</p>
                        <button class="secondary-button" id="openContactButton" type="button">Beratung anfragen</button>
                    </div>
                </div>
            </section>
        </section>

        <section class="contact panel hidden" data-view="contact">
            <div class="contact-layout">
                <div>
                    <span class="eyebrow">Ihr Küchenprofil übermitteln</span>
                    <h2>Aus Inspiration wird eine Grundlage für Ihre Planung.</h2>
                    <p>Mit der Übermittlung speichern wir Ihr Küchenprofil bei Klas Küchen. Der Wunsch nach persönlicher Rückmeldung ist bereits ausgewählt, weil Sie über „Beratung anfragen“ hierher gelangt sind. Sie können ihn unten jederzeit wieder abwählen.</p>
                    <div id="contactSummary" class="contact-summary"></div>
                </div>
                <form id="leadForm" novalidate>
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES) ?>">
                    <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                    <label>Ihr Name <input name="name" required autocomplete="name" data-matomo-mask></label>
                    <label>E-Mail-Adresse <span>für die Zuordnung Ihres Küchenprofils</span><input name="email" type="email" required autocomplete="email" data-matomo-mask></label>
                    <label>Telefon <span>optional</span><input name="phone" type="tel" autocomplete="tel" data-matomo-mask></label>
                    <div class="form-row">
                        <label>Postleitzahl <span>optional</span><input name="postal_code" inputmode="numeric" autocomplete="postal-code" maxlength="10" data-matomo-mask></label>
                        <label>Wohnort <span>optional</span><input name="city" autocomplete="address-level2" maxlength="120" data-matomo-mask></label>
                    </div>
                    <label class="check-label"><input name="callback" type="checkbox" checked> Ich wünsche eine persönliche Rückmeldung von Daniel Klas zu meinem Küchenprofil.</label>
                    <label class="check-label"><input name="consent" type="checkbox" required> <span>Ich habe die <a href="https://kuechen-klas.de/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung meines Küchenprofils zu.</span></label>
                    <p id="formError" class="form-error" role="alert"></p>
                    <button class="primary-button" type="submit">Küchenprofil übermitteln</button>
                </form>
            </div>
        </section>

        <section class="success panel hidden" data-view="success">
            <div class="success-mark">✓</div>
            <span class="eyebrow" id="successEyebrow">Sicher übermittelt</span>
            <h2 id="successTitle">Ihr Küchenprofil ist angekommen.</h2>
            <p id="successMessage">Sie können Ihr Ergebnis weiterhin ansehen oder Ihre Antworten noch einmal durchgehen.</p>
            <button class="primary-button" id="successResultButton" type="button">Ergebnis ansehen</button>
        </section>
    </main>

    <footer class="site-footer">
        <div>
            <strong>Klas Küchen</strong>
            <span>Daniel Klas · Hauptstraße 31A · 55487 Sohren</span>
        </div>
        <div class="footer-links">
            <a href="tel:+4967635189970">06763 5189970</a>
            <a href="mailto:kontakt@kuechen-klas.de">kontakt@kuechen-klas.de</a>
            <a href="https://kuechen-klas.de/impressum/">Impressum</a>
            <a href="https://kuechen-klas.de/datenschutz/">Datenschutz</a>
        </div>
    </footer>
</div>
<script src="assets/image-loader.js?v=<?= $assetVersion('assets/image-loader.js') ?>" defer></script>
<script src="assets/analytics.js?v=<?= $assetVersion('assets/analytics.js') ?>" defer></script>
<script src="assets/app.js?v=<?= $assetVersion('assets/app.js') ?>" defer></script>
</body>
</html>
