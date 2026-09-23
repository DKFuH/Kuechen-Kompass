# Küchen-Kompass v1.1

Eigenständiger Stilfinder und Planungsvorbereitung für Klas Küchen. Die App liefert zuerst ein Stilprofil und kann anschließend als strukturierter Vorqualifizierer für Raum, Alltag, Technik und Budget genutzt werden.

## Was v1.1 verbessert

- Stilscoring pro Frage normalisiert: Mehrfachauswahl zählt nicht mehr stärker als Einzelauswahl.
- Stilgewichte neu ausbalanciert; Soft Japandi hat jetzt eigenständige, starke Signalantworten.
- Nahe Stilwerte werden als Mischprofil ausgegeben, z. B. „Warm Minimal mit Soft-Japandi-Anteil“.
- Ergebnis um konkrete Gestaltungsprinzipien und einen „Darauf achten“-Hinweis erweitert.
- Prozentwerte ausdrücklich als Stilanteile/Orientierung ausgewiesen, nicht als wissenschaftliche Messung.
- Fehlende Bilder für U-Form, L-Form, Insel und „noch offen“ durch lokale SVG-Fallbacks ersetzt; keine 404-Abhängigkeit mehr.
- Budgetauswahl bewusst ohne Küchenfotos, damit Bildgeschmack die Budgetantwort nicht verfälscht.
- „Besondere Wünsche“ ist wirklich optional und blockiert kein abgeschlossen bearbeitetes Planungsprofil mehr.
- Teilweise eingegebene Raummaße werden als vorhandene Planungsinformation anerkannt.
- Kühlschrank und Kühl-Gefrierkombination schließen sich gegenseitig aus.
- „Designhaube“ wird nicht mehr doppelt als Elektrogerät und Dunstabzugsart abgefragt.
- Abluft/Umluft besitzt jetzt die Option „Noch offen“.
- Beratungs-CTA und Kontaktformular sind konsistent: Wer „Beratung anfragen“ wählt, landet mit vorausgewähltem Rückmeldewunsch bei Daniel Klas.
- Optionale Übergabe einer pseudonymen `visitor_id` aus der Elternseite per `postMessage` für die bestehende Attribution.
- IP-Rate-Limit nutzt HMAC mit zufälligem serverseitigem Secret statt festem Salt im Quellcode.
- Automatische Datenaufbewahrung (`RETENTION_DAYS`, Standard 180 Tage).
- Zustell-Outbox mit Wiederholungsversuchen für gespeicherte Leads sowie CLI-Healthcheck.

## Voraussetzungen

- PHP 8.1 oder neuer
- PHP-Erweiterungen `pdo_sqlite` und `mbstring`
- optional `curl` für n8n
- Schreibrechte für `storage/`
- für zuverlässige E-Mail-Benachrichtigung: SMTP oder n8n konfigurieren

## Installation

`.env.example` nach `.env` kopieren und mindestens den gewünschten Zustellweg konfigurieren.

```powershell
Copy-Item .env.example .env
php -S localhost:8080
```

Produktiv darf der eingebaute PHP-Server nicht verwendet werden. Bei Apache schützt die enthaltene `.htaccess` `storage/`, `bin/`, `.env`, `bootstrap.php`, `config.php` und `delivery.php`. Bei Nginx muss derselbe Schutz in der Serverkonfiguration abgebildet werden.

## Lead-Zustellung und Retry-Queue

Jeder Lead wird zuerst in SQLite gespeichert. Erst danach werden E-Mail und/oder n8n angesprochen. Scheitern alle konfigurierten Zustellwege, bleibt der Datensatz `pending` und erhält einen `next_retry_at`-Zeitpunkt. Die Retry-Abstände steigen schrittweise an; nach acht erfolglosen Versuchen wird der Datensatz als `failed` markiert.

Für den Produktivbetrieb sollte `bin/retry-deliveries.php` alle fünf Minuten per Cron ausgeführt werden, z. B.:

```cron
*/5 * * * * /usr/bin/php /pfad/zum/kuechen-kompass/bin/retry-deliveries.php >/dev/null 2>&1
```

Zusätzlich kann der Healthcheck überwacht werden:

```bash
php bin/healthcheck.php
```

Er liefert einen Fehlerstatus, wenn wesentliche PHP-Erweiterungen fehlen, kein Zustellweg eingerichtet ist oder ein `pending`-Lead älter als 15 Minuten ist.

## Datenschutz und Aufbewahrung

`RETENTION_DAYS` steuert die maximale Aufbewahrungsdauer der Einträge in SQLite. Standard sind 180 Tage. Alte Datensätze werden bei neuen Einreichungen und beim Retry-Lauf entfernt.

Für das Rate-Limit wird die IP nicht im Klartext gespeichert. Die App bildet einen HMAC. Wenn `RATE_LIMIT_SECRET` nicht gesetzt ist, wird automatisch ein zufälliges Secret in `storage/.rate-limit-secret` erzeugt.

## Attribution / visitor_id

Der Küchen-Kompass liest selbst keine Tracking-Cookies. Eine bereits vorhandene opaque `visitor_id` kann von der Elternseite nach Consent übergeben werden.

Direkt beim Einbinden:

```html
<script
  src="https://stilfinder.kuechen-klas.de/assets/embed.js"
  data-container="kuechen-kompass"
  data-visitor-id="OPAQUE_VISITOR_ID"
  defer
></script>
```

Oder nachträglich, sobald die ID im Hauptprojekt verfügbar ist:

```js
window.dispatchEvent(new CustomEvent('kuechen-kompass:set-context', {
  detail: { visitor_id: visitorId }
}));
```

Die ID wird serverseitig validiert und im Lead-Datensatz sowie im n8n-Payload gespeichert. Erlaubt sind 8–128 Zeichen aus Buchstaben, Zahlen sowie `. _ : -`.

Beim Einbetten übernimmt `embed.js` zusätzlich vorhandene `utm_*`-Parameter
der Elternseite und reicht sie als Kampagnenkontext an einen späteren Lead
weiter. Interaktionen werden ohne eigene Tracker als
`kuechen-kompass:event` an die Elternseite gemeldet. Erst die Elternseite
entscheidet anhand ihrer Einwilligungslogik, ob daraus Analyse- oder
Werbeereignisse entstehen.

## Einbetten ohne Attribution

```html
<div id="kuechen-kompass"></div>
<script
  src="https://stilfinder.kuechen-klas.de/assets/embed.js"
  data-container="kuechen-kompass"
  data-min-height="720px"
  defer
></script>
```

Die `frame-ancestors`-Richtlinie erlaubt die Einbettung auf `kuechen-klas.de`, `www.kuechen-klas.de`, deren HTTPS-Subdomains sowie der lokalen Entwicklungsdomain `kuechen-klas-2026.test`.

## Wichtiger Hinweis zum Deployment

Das ausgelieferte v1.1-ZIP enthält absichtlich **keine** bestehende SQLite-Datenbank und kein `.git`-Verzeichnis. Beim Update einer laufenden Installation die vorhandene `storage/kuechen-kompass.sqlite` beibehalten und nur den Code ersetzen. `database()` ergänzt die neuen Spalten automatisch.

## Mail-Diagnose (v1.1.1)

Wenn ein Lead als `pending` gespeichert wird, zeigt `delivery_error` jetzt den konkreten PHPMailer-/SMTP-Fehler statt nur eines generischen Fehlers.

Auf dem Server kann der Versand ohne neuen Lead getestet werden:

```bash
php bin/test-mail.php
```

Für ALL-INKL ist typischerweise folgende SMTP-Konfiguration passend:

```dotenv
MAIL_TO=kontakt@kuechen-klas.de
SMTP_HOST=<KAS-Login>.kasserver.com
SMTP_PORT=465
SMTP_USERNAME=<E-Mail-Adresse des Postfachs>
SMTP_PASSWORD=<Postfach-Passwort>
SMTP_ENCRYPTION=ssl
SMTP_FROM_EMAIL=<dieselbe E-Mail-Adresse wie SMTP_USERNAME>
SMTP_FROM_NAME="Klas Küchen Küchen-Kompass"
```

`bin/healthcheck.php` zeigt zusätzlich den Zustellstatus und den letzten gespeicherten Zustellfehler an.
