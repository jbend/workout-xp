# Workout XP

Mobile-first workout navigator for [Jeff Nippard's Essentials Program (5×/week)](https://www.jeffnippard.com/). Browse the program by week, open a workout, and step through each exercise with sets, RPE, cues, substitutions, and demo videos. Progress is saved locally on the device so you can resume where you left off.

This is a **program guide**, not a training log — it does not record weights, reps, or set history.

## What it does

- **Home** — resume the last workout/exercise, see the next workout in sequence, jump to any week
- **Program** — browse a week's days (workouts and rest days)
- **Workout** — exercise list for a day with completion checkmarks
- **Exercise** — warm-up/working sets, reps, RPE, rest, notes, substitutions, and video links

Progress (`week`, `dayId`, `exerciseId`, completed exercises) is stored in `localStorage` under `workout-xp.progress.v1`.

## Nomenclature

| Term | Meaning |
|------|---------|
| **Program** | The full training plan (`WorkoutProgram`): metadata + all weeks |
| **Week** | A numbered block in the program (`ProgramWeek`, e.g. Week 1–12) |
| **Workout day** | One calendar slot in a week (`WorkoutDay`): Upper, Lower, Rest, etc. |
| **Active workout day** | A workout day that is not a rest day (`isRestDay: false`) |
| **Rest day** | A recovery day with no exercises |
| **Exercise** | A single movement within a workout day, with prescription fields and media |
| **Resume / progress** | Client-side state remembering your last location and completed exercises for the current day |

Current program: **12 weeks**, **60 workout days**, **24 rest days**, **324 exercises**.

## Repository layout

```
workout-xp/
├── apps/web/                  # SvelteKit app (@workout-xp/web)
├── packages/
│   ├── program-data/          # Bundled program.json (@workout-xp/program-data)
│   └── program-schema/        # Types, JSON Schema, draft Postgres DDL (@workout-xp/program-schema)
├── scripts/
│   ├── import-program.py      # Import Essentials spreadsheet → program.json
│   └── docker-smoke-test.mjs  # Post-build HTTP smoke test
└── Dockerfile                 # Production Node image
```

## Requirements

- Node.js ≥ 24
- pnpm ≥ 11

Optional (spreadsheet re-import only): Python 3 + `openpyxl` (`pip install -r requirements.txt`).

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm check        # svelte-check
pnpm build        # production build
```

## Re-importing program data

The source spreadsheet is **not** in this repo. To regenerate `packages/program-data/program.json`:

```bash
python scripts/import-program.py "C:/path/to/Essentials Program - 5x_Week Spreadsheet.xlsx"
# or: WORKOUT_SOURCE_XLSX=/path/to/file.xlsx pnpm import:program
```

The importer reads the `5x Program` sheet and writes JSON validated against `packages/program-schema/program.schema.json`.

## Docker

```bash
pnpm docker:build
pnpm docker:run     # http://localhost:3000
pnpm docker:test    # build + smoke test
```

## Deployment

- **CI** — Docker build on pull requests to `main`
- **Deploy** — push to `main` builds and pushes a GHCR image, then triggers Dokploy via webhook

## Routes

| Path | Screen |
|------|--------|
| `/` | Home |
| `/week/[week]` | Week overview (days in order) |
| `/workout/[week]/[dayId]` | Workout exercise list |
| `/workout/[week]/[dayId]/[exerciseId]` | Exercise detail |

`dayId` and `exerciseId` are stable slugs (e.g. `week-1-upper-1`, `flat-db-press-heavy-1`) used for URLs and progress tracking.
