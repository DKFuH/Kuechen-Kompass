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

    <nav class="journey" id="journey" aria-label="Ihre Küchenreise"></nav>

    <div id="app" class="main" aria-live="polite">
        <section class="intro panel" data-view="intro">
            <div class="intro-copy">
                <span class="eyebrow">Ihre Küche beginnt mit einem Gefühl</span>
                <h<?= $stilfinderInline ? '3' : '1' ?>>Finden Sie heraus, welche Küche <em>wirklich</em> zu Ihnen passt.</h<?= $stilfinderInline ? '3' : '1' ?>>
                <p>Entdecken Sie zuerst Ihre persönliche Stilwelt. Danach können Sie Raum, Alltag und Wünsche ergänzen – in Ihrem Tempo und jederzeit änderbar.</p>
                <div class="intro-actions">
                    <button class="primary-button" id="startButton" type="button">Stilprofil starten</button>
                    <span>ca. 3 Minuten bis zu Ihrem Stilprofil</span>
                </div>
                <ul class="trust-list">
                    <li>Keine starren Stil-Schubladen</li>
                    <li>Ergebnis direkt nach den ersten 5 Fragen</li>
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
            <h2 id="questionTitle" tabindex="-1">Ihre Fragen zum Küchenstil</h2>
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
            <div id="resultContent" class="hidden">
                <div class="result-header">
                    <div>
                        <span class="eyebrow">Ihre erste Stilrichtung</span>
                        <h2 id="resultTitle">Ihr Stilprofil</h2>
                        <p id="resultDescription"></p>
                    </div>
                    <div class="result-seal"><strong id="profileProgress">0%</strong><span>Profil</span></div>
                </div>
                <div id="resultImage" class="result-image" role="img"></div>
                <section class="decision-card" id="decisionCard" tabindex="-1">
                    <div id="decisionPaths">
                        <div class="decision-card__intro">
                            <span class="eyebrow">Wie möchten Sie weitermachen?</span>
                            <h3>Das ist Ihre erste Stilrichtung. Jetzt prüfen wir, wie sie zu Raum, Alltag und Technik passt.</h3>
                            <p class="decision-card__progress"><span id="decisionProgress">0%</span> der Planungsfragen sind beantwortet</p>
                        </div>
                        <div class="decision-card__paths">
                            <div class="decision-path decision-path--continue" id="decisionPathContinue">
                                <h4>Profil für Raum und Alltag verfeinern</h4>
                                <p>Ergänzen Sie Raumform, Nutzung, Stauraum und Technik. So wird sichtbar, wie Ihre Stilrichtung im Küchenalltag funktionieren kann.</p>
                                <button class="primary-button" id="continuePlanningButton" type="button">Profil für meinen Raum verfeinern</button>
                            </div>
                            <div class="decision-path decision-path--submit">
                                <h4>Projekt direkt einordnen lassen</h4>
                                <p>Sie planen bereits konkret? Daniel Klas schaut sich Ihre Stilrichtung und die bisherigen Antworten persönlich an.</p>
                                <button class="primary-button primary-button--alt" id="openContactButton" type="button">Projekt einordnen lassen</button>
                            </div>
                        </div>
                    </div>
                    <div id="intentCard" class="intent-card hidden">
                        <span class="eyebrow">Ihr Küchenprofil ist komplett</span>
                        <h3>Möchten Sie, dass Daniel Klas Ihr Projekt persönlich einordnet?</h3>
                        <p>Tischlermeister Daniel Klas schaut sich Ihr Profil an und meldet sich mit einer ersten Einschätzung zu Umsetzung, Rahmen und nächsten Schritten.</p>
                        <div class="intent-card__actions">
                            <button class="primary-button" id="intentYesButton" type="button">Ja, Projekt einschätzen lassen</button>
                            <button class="secondary-button" id="intentNoButton" type="button">Nein, Profil reicht mir erstmal</button>
                        </div>
                        <p id="intentNoMessage" class="intent-card__message" aria-live="polite"></p>
                    </div>
                </section>
                <section class="profile-save" id="profileSave" aria-labelledby="profileSaveTitle">
                    <div id="profileSaveOffer" class="profile-save__offer">
                        <div>
                            <span class="eyebrow">Optional speichern</span>
                            <h3 id="profileSaveTitle">Später an dieser Stelle weitermachen</h3>
                            <p>Wir schicken Ihnen einen persönlichen Link zu Ihrem aktuellen Profil. Das Ergebnis und das direkte Weiterplanen bleiben auch ohne E-Mail frei zugänglich.</p>
                        </div>
                        <button class="secondary-button" id="profileSaveButton" type="button">Profil per E-Mail speichern</button>
                    </div>
                    <form id="resultGateForm" class="profile-save__form hidden" novalidate>
                        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($stilfinderCsrfToken, ENT_QUOTES, 'UTF-8') ?>">
                        <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                        <h3>Speicherlink erhalten</h3>
                        <p>Der Link öffnet Ihr Profil mit den bisherigen Antworten auf diesem Gerät oder einem anderen.</p>
                        <label for="resultGateEmail">E-Mail-Adresse</label>
                        <input id="resultGateEmail" name="email" type="email" required placeholder="ihre@email.de" autocomplete="email" data-matomo-mask>
                        <label class="check-label"><input name="consent" type="checkbox" required> <span>Ja, schicken Sie mir den Link zu meinem Stilprofil per E-Mail. Einmalige Service-Nachricht, kein Newsletter.</span></label>
                        <label class="check-label"><input name="marketing_consent" type="checkbox"> <span>Zusätzlich möchte ich eine kurze, auf mein Stilprofil abgestimmte Mail-Serie zu Materialien, Planung und nächsten Schritten erhalten. Nach Abschluss dieser Serie erhalte ich ohne neue Einwilligung keine weiteren E-Mails.</span></label>
                        <button class="primary-button" type="submit">Speicherlink senden</button>
                        <p id="resultGateError" class="form-error" role="alert"></p>
                    </form>
                    <p id="profileSaveSuccess" class="profile-save__success hidden" role="status">Ihr Profil ist gespeichert. Den persönlichen Link haben wir Ihnen per E-Mail geschickt.</p>
                </section>
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
                <section class="result-reading hidden" id="resultReading" aria-labelledby="resultReadingTitle">
                    <span class="eyebrow">Mehr zu Ihrer Stilwelt</span>
                    <h3 id="resultReadingTitle">Weiterlesen und vergleichen</h3>
                    <ul id="resultReadingList"></ul>
                    <p class="result-reading__note">Die Seiten öffnen sich in einem neuen Tab – Ihr Profil bleibt hier erhalten.</p>
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
            </div>
        </section>

        <section class="contact panel hidden" data-view="contact">
            <div class="contact-layout">
                <div>
                    <span class="eyebrow">Ihr Küchenprofil übermitteln</span>
                    <h2>Aus Inspiration wird eine Grundlage für Ihre Planung.</h2>
                    <p>Mit Ihrer Postleitzahl ordnen wir ein, ob Ihr Projekt in unserem persönlichen Planungsgebiet liegt (etwa 70 km um Sohren). Der Wunsch nach persönlicher Rückmeldung ist bereits ausgewählt – Sie können ihn unten jederzeit wieder abwählen.</p>
                    <div id="contactSummary" class="contact-summary"></div>
                </div>
                <form id="leadForm" novalidate>
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($stilfinderCsrfToken, ENT_QUOTES, 'UTF-8') ?>">
                    <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
                    <label>Ihr Name <input name="name" required autocomplete="name" data-matomo-mask></label>
                    <label>E-Mail-Adresse <span>für die Zuordnung Ihres Küchenprofils</span><input name="email" type="email" required autocomplete="email" data-matomo-mask></label>
                    <div class="form-row">
                        <label>Postleitzahl <span>des Projekts</span><input name="postal_code" required pattern="\d{5}" inputmode="numeric" autocomplete="postal-code" maxlength="5" data-matomo-mask></label>
                        <label>Wohnort <span>optional</span><input name="city" autocomplete="address-level2" maxlength="120" data-matomo-mask></label>
                    </div>
                    <label>Telefon <span>optional, für eine schnelle Rückfrage</span><input name="phone" type="tel" autocomplete="tel" data-matomo-mask></label>
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
