"""Make data/sauti.csv: every voice line to record in ElevenLabs.

Usage: python3 app/tools/make_sauti.py
Group A = core game phrases (data/sauti.json)
Group B = each methali read aloud (data/methali.json)
Group C = each crop and animal name said clearly (data/mazao.json, data/wanyama.json)
"""
import csv
import json
import pathlib

REPO = pathlib.Path(__file__).resolve().parents[2]


def load(name):
    return json.loads((REPO / "data" / name).read_text(encoding="utf-8"))


rows = []
for line in load("sauti.json")["lines"]:
    rows.append(["A", line["id"], line["text"], line["en"], line["where"]])
for q in load("methali.json")["questions"]:
    rows.append(["B", f"methali_{q['id']}", q["text"], q["translation_en"], "Malizia Methali, 'Sikiliza' after answering"])
for c in load("mazao.json")["crops"]:
    rows.append(["C", f"zao_{c['id']}", c["word"].capitalize() + ".", c["en"], "Mazao, 'Sikiliza' after the round"])
for a in load("wanyama.json")["animals"]:
    rows.append(["C", f"mnyama_{a['id']}", a["word"].capitalize() + ".", a["en"], "Wanyama, 'Sikiliza' after the round"])

out = REPO / "data" / "sauti.csv"
with out.open("w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["group", "file_name", "swahili_text", "english", "used_in"])
    for r in rows:
        w.writerow([r[0], r[1] + ".mp3", r[2], r[3], r[4]])
print(f"wrote {out} with {len(rows)} lines")
