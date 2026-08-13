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

PHPs eingebauter Entwicklungsserver liest `.env` nicht automatisch. Für einen
schnellen Test können die Variablen vorher in PowerShell gesetzt werden:

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
oder Nginx sollte der direkte HTTP-Zugriff auf folgende Dateien und Ordner
gesperrt werden:

- `storage/`
- `config.php`
- `bootstrap.php`
- `.env`

Empfohlen ist zusätzlich ein tägliches, externes Backup der SQLite-Datei.

## Konfiguration

Die Anwendung nutzt Umgebungsvariablen:

| Variable | Funktion |
| --- | --- |
| `MAIL_TO` | Empfänger der internen Benachrichtigung |
| `MAIL_FROM` | Absenderadresse der Benachrichtigung |
| `N8N_WEBHOOK_URL` | optionaler n8n-Webhook |
| `N8N_WEBHOOK_SECRET` | optionaler Schlüssel für die HMAC-Signatur |

Fragen, Antworten und Stilgewichtungen stehen am Anfang von `assets/app.js`.
Die sichtbaren Farben und das Erscheinungsbild werden in `assets/app.css`
über CSS-Variablen gesteuert.

## Noch vor dem Livegang

- echte Küchen- und Materialbilder mit geklärten Nutzungsrechten einsetzen
- Link zu den finalen Datenschutzhinweisen ergänzen
- Mailzustellung und n8n-Webhook im Zielhosting testen
- serverseitigen Schutz des `storage`-Ordners prüfen
- Ergebnis-PDF und Datei-/Grundriss-Upload in einer nächsten Ausbaustufe ergänzen

