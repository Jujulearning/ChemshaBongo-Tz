"""Build the Chemsha Bongo beta into one self-contained HTML page.

Usage: python3 app/build.py
Writes app/index.html (full document for GitHub Pages or any static host)
and app/dist/artifact.html (body-only version for the Claude artifact).
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent
SRC = ROOT / "src"


def data(name):
    return json.dumps(json.loads((REPO / "data" / name).read_text(encoding="utf-8")), ensure_ascii=False, separators=(",", ":"))


css = (SRC / "style.css").read_text(encoding="utf-8")
audio_dir = ROOT / "audio"
audio_ids = sorted(f.stem for f in audio_dir.glob("*.mp3")) if audio_dir.exists() else []
js = "\n".join([
    f"const AUDIO_FILES={json.dumps(audio_ids)};",
    f"const METHALI={data('methali.json')};",
    f"const GEO={data('jiografia.json')};",
    f"const CHORA={data('chora.json')};",
    f"const MAZAO={data('mazao.json')};",
    f"const HEADSUP={data('headsup.json')};",
    f"const WANYAMA={data('wanyama.json')};",
    (SRC / "art.js").read_text(encoding="utf-8"),
    (SRC / "app.js").read_text(encoding="utf-8"),
])

body = f"""<title>Chemsha Bongo Beta</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Public+Sans:wght@400;500;600;700;800&display=swap">
<style>
{css}
</style>
<main class="app" id="app"></main>
<canvas id="confetti" aria-hidden="true"></canvas>
<script>
{js}
</script>
"""

full = f"""<!doctype html>
<html lang="sw">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
{body}</body>
</html>
"""

(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "artifact.html").write_text(body, encoding="utf-8")
(ROOT / "index.html").write_text(full, encoding="utf-8")
(ROOT / "dist" / "app.js").write_text(js, encoding="utf-8")
print("built", len(full), "bytes")
