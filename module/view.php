<?php
declare(strict_types=1);

$stilfinderCsrfToken = isset($stilfinderCsrfToken) ? (string) $stilfinderCsrfToken : '';
$stilfinderAssetBase = isset($stilfinderAssetBase) ? rtrim((string) $stilfinderAssetBase, '/') . '/' : './';
$stilfinderInline = isset($stilfinderInline) ? (bool) $stilfinderInline : false;
?>
<div class="kk-stilfinder<?= $stilfinderInline ? ' kk-stilfinder--inline' : '' ?>" data-kuechen-stilfinder><div class="app-shell">
    <header class="topbar">
        <a class="brand" href="/" aria-label="Küchen-Kompass Startseite">
            <span class="brand-mark">K</span>
            <span><strong>Küchen-Kompass</strong><small>von Klas Küchen</small></span>
        </a>
        <button class="quiet-button" id="restartButton" type="button">Neu starten</button>
    </header>

    <nav class="journey" id="journey" aria-label="Deine Küchenreise"></nav>

    <div id="app" class="main" aria-live="polite">
        <section class="intro panel" data-view="intro">
            <div class="intro-copy">
                <span class="eyebrow">Deine Küche beginnt mit einem Gefühl</span>
                <h<?= $stilfinderInline ? '3' : '1' ?>>Finde heraus, welche Küche <em>wirklich</em> zu dir passt.</h<?= $stilfinderInline ? '3' : '1' ?>>
                <p>Wähle zuerst aus, was dir gefällt. Danach kannst du Raum, Alltag und Wünsche ergänzen – in deinem Tempo und jederzeit änderbar.</p>
                <div class="intro-actions">
                    <button class="primary-button" id="startButton" type="button">Stilprofil starten</button>
                    <span>5 Fragen bis zu deiner Stilrichtung</span>
                </div>
                <ul class="trust-list">
                    <li>Keine starren Stil-Schubladen</li>
                    <li>Konkrete Hinweise zu Farben und Materialien</li>
                    <?php if (!$stilfinderInline): ?>
                        <li>Keine Analyse- oder Marketingdienste</li>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="intro-visual" aria-hidden="true">
                <img src="<?= htmlspecialchars($stilfinderAssetBase . 'assets/images/hero-kitchen.webp', ENT_QUOTES, 'UTF-8') ?>" alt="Helle, ruhig geplante Küche als Einstieg in den Küchen-Stilfinder" width="1000" height="1000" fetchpriority="high">
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
            <h2 id="questionTitle" tabindex="-1">Deine Fragen zum Küchenstil</h2>
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
            <div id="hardGate" class="hard-gate hidden">
                <span class="eyebrow">Dein Stilergebnis ist fertig</span>
                <h2 id="hardGateTitle" tabindex="-1">Wohin dürfen wir dein Stilprofil schicken?</h2>
                <p>Gib deine E-Mail-Adresse ein. Du siehst deine Stilrichtung sofort und bekommst zwei Dinge: einen Link, mit dem du später genau hier weitermachst, und unseren Newsletter mit Planungstipps und Angeboten rund um deine Küche.</p>
                <form id="hardGateForm" class="profile-save__form" novalidate>
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($stilfinderCsrfToken, ENT_QUOTES, 'UTF-8') ?>">
                    <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                    <label for="hardGateEmail">E-Mail-Adresse</label>
                    <input id="hardGateEmail" name="email" type="email" required placeholder="ihre@email.de" autocomplete="email" data-matomo-mask>
                    <label class="check-label"><input name="marketing_consent" type="checkbox" required> <span>Mit der Anforderung meines Stilprofils willige ich ein, dass Klas Küchen® mir einen persönlichen Link sowie Informationen, Planungstipps und Angebote rund um Küchen und Küchenplanung per E-Mail zusendet. Ich kann mich jederzeit wieder abmelden. Weitere Hinweise finde ich in der <a href="https://kuechen-klas.de/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</span></label>
                    <button class="primary-button" type="submit">Stilprofil anzeigen</button>
                    <p id="hardGateError" class="form-error" role="alert"></p>
                </form>
                <p class="hard-gate__note">Gleich kommen zwei E-Mails: dein Link zum Weitermachen und die Bitte, den Newsletter zu bestätigen. Ohne Bestätigung bekommst du keinen Newsletter. Abmelden geht jederzeit.</p>
            </div>
            <div id="resultContent" class="hidden">
                <div class="result-header">
                    <div>
                        <span class="eyebrow" id="resultEyebrow">Deine erste Stilrichtung</span>
                        <h2 id="resultTitle">Dein Stilprofil</h2>
                        <p id="resultDescription"></p>
                    </div>
                    <div class="result-seal"><strong id="profileProgress">0%</strong><span>Profil</span></div>
                </div>
                <div id="resultImage" class="result-image" role="img"></div>
                <section class="decision-card" id="decisionCard" tabindex="-1">
                    <div id="decisionPaths">
                        <div class="decision-card__intro">
                            <span class="eyebrow">Dein nächster Schritt</span>
                            <h3>Das ist deine erste Stilrichtung. Jetzt kannst du prüfen, wie sie zu Raum, Alltag und Technik passt.</h3>
                        </div>
                        <button class="primary-button decision-card__primary" id="continuePlanningButton" type="button">Profil für meinen Raum verfeinern</button>
                        <p class="decision-card__value">Danach siehst du dein vollständiges Profil mit Stilanteilen, Farb- und Materialwelt, konkreten Stilhinweisen und deinen Planungsangaben.</p>
                        <div class="decision-card__minor">
                            <button class="text-button" id="openContactButton" type="button">Du planst schon konkret? Projekt direkt einordnen lassen</button>
                        </div>
                    </div>
                    <div id="intentCard" class="intent-card hidden">
                        <div class="contact-layout">
                            <div>
                                <span class="eyebrow">Kostenloses Beratungsgespräch</span>
                                <h3>Besprich dein Stilprofil mit dem Tischlermeister</h3>
                                <p>Ein Stil ist ein Anfang. Ob er funktioniert, entscheiden Raum, Licht, Abläufe und Stauraum. Genau darüber spricht Daniel Klas mit dir: persönlich, ehrlich und ohne Verkaufsdruck.</p>
                                <p class="consult-list__title"><strong>Im Gespräch klären wir:</strong></p>
                                <ul class="consult-list">
                                    <li>wie deine Stilrichtung zu Raum und Licht passt</li>
                                    <li>deine Sonderwünsche, vom Backofen auf Augenhöhe bis zum festen Platz für die Küchenmaschine</li>
                                    <li>welcher Budgetrahmen realistisch ist</li>
                                    <li>den sinnvollen nächsten Schritt</li>
                                </ul>
                                <p class="consult-stance">Der Rabatt ist schnell vergessen. Eine schlecht geplante Küche nicht.</p>
                                <div id="contactSummary" class="contact-summary"></div>
                            </div>
                            <form id="leadForm" novalidate>
                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($stilfinderCsrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                                <label>Dein Name <input name="name" required autocomplete="name" data-matomo-mask></label>
                                <label>E-Mail-Adresse <span>für die Zuordnung deines Küchenprofils</span><input name="email" type="email" required autocomplete="email" data-matomo-mask></label>
                                <div class="form-row">
                                    <label>Postleitzahl <span>des Projekts</span><input name="postal_code" required pattern="\d{5}" inputmode="numeric" autocomplete="postal-code" maxlength="5" data-matomo-mask></label>
                                    <label>Wohnort <span>optional</span><input name="city" autocomplete="address-level2" maxlength="120" data-matomo-mask></label>
                                </div>
                                <label class="check-label"><input name="callback" type="checkbox"> <span><strong>Lieber telefonisch?</strong><br>Daniel Klas (Klas Küchen®) darf mich unter der angegebenen Telefonnummer zu meinem Küchenprofil und einer möglichen Küchenplanung anrufen. Die Einwilligung ist freiwillig und kann jederzeit mit Wirkung für die Zukunft widerrufen werden, zum Beispiel per E-Mail an kontakt@kuechen-klas.de.</span></label>
                                <label id="callbackPhoneField" class="hidden">Telefonnummer <span>für den gewünschten Rückruf</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="60" data-matomo-mask></label>
                                <label class="check-label"><input name="consent" type="checkbox" required> <span>Ich habe die <a href="https://kuechen-klas.de/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage zu.</span></label>
                                <p id="formError" class="form-error" role="alert"></p>
                                <button class="primary-button" type="submit">Kostenloses Beratungsgespräch anfragen</button>
                                <p class="consult-after">Daniel Klas meldet sich persönlich per E-Mail, oder per Telefon, wenn du das oben auswählst.</p>
                            </form>
                        </div>
                    </div>
                </section>
                <section class="profile-save hidden" id="profileSave">
                    <p id="profileSaveSuccess" class="profile-save__success" role="status">Dein Profil ist gespeichert. Den Link zum Weitermachen haben wir dir per E-Mail geschickt.</p>
                </section>
                <div id="resultFull">
                <div class="style-mix-heading"><strong>Deine Stilanteile</strong><span>Orientierungswerte aus deinen Antworten – keine Messwerte.</span></div>
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
                <section class="result-reading hidden" id="resultReading" aria-labelledby="resultReadingTitle">
                    <span class="eyebrow">Mehr zu deiner Stilwelt</span>
                    <h3 id="resultReadingTitle">Weiterlesen und vergleichen</h3>
                    <ul id="resultReadingList"></ul>
                    <p class="result-reading__note">Die Seiten öffnen sich in einem neuen Tab – dein Profil bleibt hier erhalten.</p>
                </section>
                <div class="result-layout">
                    <div>
                        <h3>Deine Material- und Farbwelt</h3>
                        <div id="moodboard" class="moodboard"></div>
                    </div>
                    <aside class="insight-card">
                        <span class="eyebrow">Planungshinweis</span>
                        <p id="resultInsight"></p>
                    </aside>
                </div>
                <div id="planningSummary" class="planning-summary hidden">
                    <h3>Deine Planungsangaben</h3>
                    <div id="planningGrid" class="planning-grid"></div>
                </div>
                <div class="result-consult-return">
                    <button class="primary-button" id="bottomConsultButton" type="button">Kostenloses Beratungsgespräch anfragen</button>
                </div>
                </div>
            </div>
        </section>

        <section class="success panel hidden" data-view="success">
            <div class="success-mark">✓</div>
            <span class="eyebrow" id="successEyebrow">Sicher übermittelt</span>
            <h2 id="successTitle">Dein Küchenprofil ist angekommen.</h2>
            <p id="successMessage">Du kannst dein Ergebnis weiterhin ansehen oder deine Antworten noch einmal durchgehen.</p>
            <div class="success-actions">
                <a class="primary-button hidden" id="successAppointment" href="#" target="_blank" rel="noopener" data-track="stilfinder_appointment">Termin direkt wählen</a>
                <button class="secondary-button" id="successResultButton" type="button">Ergebnis ansehen</button>
            </div>
        </section>
    </div>

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
</div>
