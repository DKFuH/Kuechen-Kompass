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
?>
<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Entdecken Sie Ihren Küchenstil und erstellen Sie Ihr persönliches Küchenprofil.">
    <meta name="theme-color" content="#8c6a4f">
    <meta name="csrf-token" content="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES) ?>">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>Küchen-Kompass | Klas Küchen</title>
    <link rel="stylesheet" href="assets/app.css">
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
                    <button class="primary-button" id="startButton" type="button">Küchenreise starten</button>
                    <span>ca. 3 Minuten bis zum ersten Ergebnis</span>
                </div>
                <ul class="trust-list">
                    <li>Keine starren Stil-Schubladen</li>
                    <li>Zwischenergebnis ohne Kontaktdaten</li>
                    <li>Fortschritt bleibt auf diesem Gerät gespeichert</li>
                </ul>
            </div>
            <div class="intro-visual" aria-hidden="true">
                <img src="assets/images/hero-kitchen.webp" alt="" width="900" height="1125" fetchpriority="high">
                <div class="compass"><span>Ihr Stil</span></div>
            </div>
        </section>

        <section class="quiz panel hidden" data-view="quiz">
            <div class="question-meta">
                <span id="sectionLabel" class="eyebrow"></span>
                <span id="questionCounter"></span>
            </div>
            <h2 id="questionTitle"></h2>
            <p id="questionHelp" class="question-help"></p>
            <p id="selectionMessage" class="selection-message" role="status" aria-live="polite"></p>
            <div id="answers" class="answer-grid"></div>
            <div class="quiz-footer">
                <button class="secondary-button" id="backButton" type="button">Zurück</button>
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
            <div id="styleBars" class="style-bars"></div>
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
            <div class="result-actions">
                <button class="primary-button" id="continuePlanningButton" type="button">Küchenprofil vervollständigen</button>
                <button class="secondary-button" id="openContactButton" type="button">Profil zur Beratung übermitteln</button>
            </div>
        </section>

        <section class="contact panel hidden" data-view="contact">
            <div class="contact-layout">
                <div>
                    <span class="eyebrow">Ihr Küchenprofil übermitteln</span>
                    <h2>Aus Inspiration wird eine Grundlage für Ihre Planung.</h2>
                    <p>Wir speichern Ihr Küchenprofil bei Klas Küchen, damit wir Ihre Angaben zuordnen und für eine spätere Beratung wieder aufgreifen können. Eine persönliche Rückmeldung erfolgt nur, wenn Sie sie unten ausdrücklich wünschen.</p>
                    <div id="contactSummary" class="contact-summary"></div>
                </div>
                <form id="leadForm" novalidate>
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES) ?>">
                    <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                    <label>Ihr Name <input name="name" required autocomplete="name"></label>
                    <label>E-Mail-Adresse <span>für die Zuordnung Ihres Küchenprofils</span><input name="email" type="email" required autocomplete="email"></label>
                    <label>Telefon <span>optional</span><input name="phone" type="tel" autocomplete="tel"></label>
                    <div class="form-row">
                        <label>Postleitzahl <span>optional</span><input name="postal_code" inputmode="numeric" autocomplete="postal-code" maxlength="10"></label>
                        <label>Wohnort <span>optional</span><input name="city" autocomplete="address-level2" maxlength="120"></label>
                    </div>
                    <label class="check-label"><input name="callback" type="checkbox"> Ich wünsche eine persönliche Rückmeldung zu meinem Küchenprofil.</label>
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
<script src="assets/app.js" defer></script>
</body>
</html>
