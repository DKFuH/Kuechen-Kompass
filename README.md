# Küchen-Kompass

Eigenständiger Küchenstil-Finder und Planungsvorbereitung für
`stilfinder.kuechen-klas.de`.

## Enthalten

- visuelle Einzelfragen statt langem Formular
- frei anwählbare Entscheidungs-Zeitleiste
- Zurückspringen und Ändern früherer Antworten
- lokales Fortsetzen über `localStorage`
- gewichteter Stil-Mix mit persönlichem Ergebnis
- optionale zweite Etappe für Raum, Alltag, Technik und Rahmen
- Technik-Fragen aus der bisherigen Küchencheckliste integriert: Raummaße,
  Elektrogeräte, Dunstabzug (Betriebsart und Bauart), Mülltrennung, Beleuchtung
- Planungsübersicht mit allen technischen Angaben auf der Ergebnisseite
- sichere serverseitige Speicherung in SQLite
- Benachrichtigung per PHP-Mail (inklusive Raummaße, falls angegeben)
- optionale Weitergabe an n8n mit HMAC-Signatur
- CSRF-Schutz, Honeypot, Validierung und einfaches Rate-Limit

## Gestaltung

Farben, Schriften (Space Grotesk / Instrument Serif) und Radien sind an die CI
von `kuechen-klas.de-2026` angelehnt (Terrakotta-Akzent `#8c6a4f`). Die
Schriftdateien liegen selbst gehostet unter `assets/fonts/`, es werden keine
externen Font-Anfragen ausgelöst.

## Voraussetzungen

- PHP 8.1 oder neuer
- PHP-Erweiterungen `pdo_sqlite` und `mbstring`
- optional `curl` für n8n
- Schreibrechte für den Ordner `storage/`

## Lokal unter Windows starten

```powershell
cd C:\dev\kuechen-kompass
Copy-Item .env.example .env
php -S localhost:8080
```

Dann `http://localhost:8080` öffnen.

Die Anwendung lädt eine vorhandene `.env` beim ersten Zugriff. Alternativ
können die Variablen für einen einzelnen Testlauf in PowerShell gesetzt werden:

```powershell
$env:MAIL_TO = "kontakt@kuechen-klas.de"
$env:MAIL_FROM = "stilfinder@kuechen-klas.de"
$env:N8N_WEBHOOK_URL = "https://n8n.example.de/webhook/kuechen-kompass"
$env:N8N_WEBHOOK_SECRET = "einen-langen-zufaelligen-wert-eintragen"
php -S localhost:8080
```

## Produktivbetrieb

Den Document Root auf den Projektordner setzen. Der Ordner `storage` muss für
den PHP-Prozess beschreibbar, aber von außen nicht abrufbar sein. Bei Apache
übernimmt die enthaltene `.htaccess` den Zugriffsschutz. Bei Nginx oder einer
anderen Serverkonfiguration muss der direkte HTTP-Zugriff mindestens auf
folgende Dateien und Ordner gesperrt werden:

- `storage/`
- `config.php`
- `bootstrap.php`
- `.env`
- `.git/`
- `README.md`

PHPs eingebauter Entwicklungsserver wertet `.htaccess` nicht aus und darf
daher nicht als öffentlicher Produktivserver verwendet werden.

Empfohlen ist zusätzlich ein tägliches, externes Backup der SQLite-Datei.

## Konfiguration

Die Anwendung nutzt Umgebungsvariablen:

| Variable | Funktion |
| --- | --- |
| `MAIL_TO` | Empfänger der internen Benachrichtigung |
| `MAIL_FROM` | Absenderadresse der Benachrichtigung |
| `N8N_WEBHOOK_URL` | optionaler n8n-Webhook |
| `N8N_WEBHOOK_SECRET` | optionaler Schlüssel für die HMAC-Signatur |

Eine Anfrage gilt als „übermittelt“, sobald PHP-Mail oder der konfigurierte
n8n-Webhook die Nachricht angenommen hat. Ist noch keine Zustellung bestätigt,
bleibt das Profil in SQLite gespeichert und die Oberfläche weist transparent
auf die ausstehende interne Benachrichtigung hin. Der technische Status wird in
`delivery_status` und `delivery_error` protokolliert, damit ausstehende Fälle
gezielt geprüft werden können.

Fragen, Antworten und Stilgewichtungen stehen am Anfang von `assets/app.js`.
Die sichtbaren Farben und das Erscheinungsbild werden in `assets/app.css`
über CSS-Variablen gesteuert.

## In eine Website einbetten

Der Parameter `?embed=1` aktiviert die rahmenlose Ansicht ohne eigenen Kopf-
und Fußbereich. Für eine automatisch angepasste Höhe auf `kuechen-klas.de`
kann die Seite so eingebunden werden:

```html
<div id="kuechen-kompass"></div>
<script
  src="https://stilfinder.kuechen-klas.de/assets/embed.js"
  data-container="kuechen-kompass"
  data-min-height="720px"
  defer
></script>
```

Alternativ funktioniert ein direktes Iframe mit fester Mindesthöhe:

```html
<iframe
  src="https://stilfinder.kuechen-klas.de/?embed=1"
  title="Küchen-Kompass – persönlichen Küchenstil finden"
  loading="lazy"
  style="display:block;width:100%;min-height:900px;border:0"
></iframe>
```

Die `frame-ancestors`-Richtlinie erlaubt die Einbettung ausschließlich auf
`kuechen-klas.de`, `www.kuechen-klas.de`, deren HTTPS-Subdomains sowie auf der
lokalen Entwicklungsdomain `kuechen-klas-2026.test`.

## Noch vor dem Livegang

- echte Küchen- und Materialbilder mit geklärten Nutzungsrechten einsetzen
- Mailzustellung und n8n-Webhook im Zielhosting testen
- serverseitigen Schutz des `storage`-Ordners prüfen
- Ergebnis-PDF und Datei-/Grundriss-Upload in einer nächsten Ausbaustufe ergänzen
