# Chemsha Bongo

## Beta (for testers)

`app/index.html` is a playable beta that runs in any phone browser. It is one self-contained file, so it works from GitHub Pages (Settings › Pages › deploy from `main`, then open `/app/`) or any static host.

What's in it:
- **Onboarding**: preferred name, email, age (required; under 13 needs parent or guardian consent), level (Chipukizi, Mjanja, Dingi), and an avatar or selfie. The selfie is resized and kept on the device only.
- **Playable modes**: Malizia Methali, Unaijua Dar?, Mazao (crop hangman), Wanyama (animal hangman), Heads Up!, Chora Tuone.
- **How to play + practice round** for every mode. The first time a tester taps a mode, the instructions open first.
- **Streaks**: a daily streak (play once a day to keep it) and an in-round streak that adds bonus points.
- **Celebrations**: confetti and the player's avatar or selfie on a win.
- **League**: monthly table with the playoff cut line (other players are sample data in the beta).

Beta limits: progress, profile and selfie are saved in the tester's browser only; nothing is sent to a server yet. Heads Up uses tap buttons instead of tilting.

To rebuild after editing `app/src/` or `data/`: `python3 app/build.py`.

A Swahili culture and language game for phones. Players finish methali, guess translations and bongo flava lines, fill gaps in Swahili stories, and play Heads Up with East African famous figures, films, history and TV. Play solo or with friends, and climb a monthly league that ends in playoffs.

## Game modes

| # | Mode | What the player does |
|---|------|----------------------|
| 01 | **Malizia Methali** | Finish the proverb from four options, then see its meaning. |
| 02 | **Tafsiri Haraka** | Pick the right translation against the clock. |
| 03 | **Bongo Flava** | Guess the missing line. *Needs licensed lyrics: partner with artists or labels before launch.* |
| 04 | **Jaza Pengo** | Fill the gaps in a short Swahili story. |
| 05 | **Unaijua Dar?** | Geography: questions about a region ("Unaijua Iringa?"), with a hint that costs points. Players represent their mkoa in a region league. |
| 06 | **Chora Tuone** | Pictionary: the drawer gets a Swahili word (e.g. *jokofu*, *darubini*) and draws it; guessers type the word in Swahili. Pass-and-play first, async with friends later. |
| 07 | **Mazao** | Hangman with crops: guess the crop's name from its picture (clear for Chipukizi, lightly blurred for Mjanja and Dingi, sharpening with each correct letter). Six water drops; run out and the plant wilts. Hints: where in Tanzania it grows, and what it's known for. |
| 09 | **Wanyama** | Same as Mazao with Tanzanian wildlife photos (simba, twiga, kiboko, nyani, pundamilia, fisi, mamba). Hints: where to see it, and what it's known for. |
| 08 | **Heads Up!** | Phone on forehead; teammates describe a famous person, film, moment or show. Tilt down for correct, up to pass. |

All modes work **peke yako** (solo) or **na marafiki** (multiplayer).

## Levels

| Level | Meaning | Content |
|-------|---------|---------|
| **Chipukizi** | Beginner, "just sprouting" | Short, well-known methali, simple words, extra time |
| **Mjanja** | Amateur, "street smart" | Bongo flava, everyday sayings, tighter timer |
| **Dingi** | Professional, "the OG" | Archaic and dialect methali, deep history, no mercy |

Players pick a level at onboarding and move up as they climb the league.

## Onboarding

1. **Karibu**: preferred name (shown on the league), email, and age.
2. **Kiwango**: choose a level.

**Age is required.** It filters content (each question has a `min_age`) so players only see songs, films and sayings suited to them. Players under 13 need verified parental consent; confirm requirements under COPPA (US), Kenya's Data Protection Act and Tanzania's Personal Data Protection Act before launch.

## League and playoffs

- A league runs each calendar month, with tables for Tanzania, East Africa and friends.
- Every correct answer earns points; streaks earn bonuses.
- The top 16 at month end enter knockout playoffs (1st–3rd of the next month). The winner takes the monthly crown.
- Early on, start with weekly challenges and friend leagues until there are enough players for full playoffs.

## Repository layout

```
data/methali.json     Questions for Malizia Methali (86 across all three levels)
data/jiografia.json   Seed questions for Unaijua (12 places, 18 questions)
data/chora.json       Drawing words for Chora Tuone (34 words by level)
data/mazao.json       Crops for the Mazao game, with where they grow and what they're known for
data/headsup.json     Heads Up decks (famous people, history, places, food, culture)
data/wanyama.json     Animals for the Wanyama game
data/credits.md       Photo credits to fill in
app/index.html        Playable beta (built file)
app/src/              Beta source: style.css, art.js (illustrations), app.js (screens and games)
app/build.py          Bundles src + data into app/index.html
design/mockups/       MVP screen designs (Claude Design canvas source files)
```

### `data/methali.json`

Each question:

```json
{
  "id": 448,
  "prompt": "Mtaka cha mvunguni sharti ___.",
  "blank": "ainame",
  "options": ["ainame", "aruke", "alale", "aombe"],
  "meaning_sw": "...",
  "meaning_en": "...",
  "level": "mjanja",
  "min_age": 8,
  "theme": "bidii"
}
```

The correct answer is always first in `options`; shuffle in the app. Proverbs come from the University of Illinois *Swahili Proverbs* collection (Ambition section); `id` is the source entry number. Translations and meanings are our own wording. A few entries are excluded until an 18+ tier exists (see `excluded_from_source`).

## Design

Light, print-inspired look based on kanga cloth: cream paper, ink black, kanga red `#C2362B` and yellow `#F2C230`, a striped kanga border, Archivo (expanded) for headings and Public Sans for text.

Screens in `design/mockups/`: onboarding (Karibu, Kiwango), home, a Methali round, the monthly league, a geography round, a Chora Tuone drawing turn, and the Heads Up card (landscape).

## MVP plan

1. Launch with **Malizia Methali**, **Heads Up!** and **Unaijua Dar?** (cheap to build, easy to share; geography is mostly content work).
2. Onboarding with age-based content filtering.
3. Weekly challenges and friend leagues; monthly playoffs once the player base supports it.
4. Early update: **Chora Tuone** as pass-and-play on one phone; async drawing with friends after that.
5. Then add Tafsiri Haraka, Jaza Pengo, and Bongo Flava (after lyric licensing).

## Voices (ElevenLabs)

All voice lines are in `data/sauti.csv` (128 lines):
- **Group A**: 22 game phrases ("Sahihi!", "Muda umekwisha!", the Heads Up countdown, win and lose lines). Source: `data/sauti.json`.
- **Group B**: each methali read aloud, played from a **Sikiliza** button after answering.
- **Group C**: each crop and animal name said clearly, played from **Sikiliza** after the round.

To add them:
1. Generate each line in ElevenLabs with one Swahili voice, using the `swahili_text` column.
2. Download each as MP3 and name it exactly as in the `file_name` column (e.g. `sahihi_1.mp3`).
3. Put the files in `app/audio/` and run `python3 app/build.py`, then commit.

The app only plays lines that have a file, so you can add them a few at a time. Players can switch voices off on the Wasifu (profile) screen. Use a paid ElevenLabs plan for anything public: free-plan audio can't be used commercially.

After adding methali, crops or animals, run `python3 app/tools/make_sauti.py` to refresh the CSV.
