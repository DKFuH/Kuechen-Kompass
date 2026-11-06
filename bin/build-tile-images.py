"""Erzeugt kleine Kachelvarianten der Stilfinder-Antwortbilder.

Die Antwortkarten zeigen Bilder höchstens ca. 320 px breit (Retina: 640 px).
Die Originale (1536 x 1024) bleiben für Ergebnisbild und Neuberechnung liegen.

Aufruf: python bin/build-tile-images.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / 'module' / 'assets' / 'images'
TARGET = ROOT / 'tiles'
PREFIXES = (
    'feeling-', 'form-', 'palette-', 'material-', 'handle-', 'room-', 'shape-',
    'household-', 'appliance-', 'lighting-', 'timeframe-',
)
WIDTH = 640
QUALITY = 72

TARGET.mkdir(exist_ok=True)
for source in sorted(ROOT.glob('*.webp')):
    if not source.name.startswith(PREFIXES):
        continue
    with Image.open(source) as image:
        image = image.convert('RGB')
        height = round(image.height * WIDTH / image.width)
        tile = image.resize((WIDTH, height), Image.LANCZOS)
        destination = TARGET / source.name
        tile.save(destination, 'WEBP', quality=QUALITY, method=6)
        print(f'{source.name}: {source.stat().st_size // 1024} KB -> {destination.stat().st_size // 1024} KB')
