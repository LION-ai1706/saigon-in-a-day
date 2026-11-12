# Saigon in a Day

A mobile-first web app that plans a one-day itinerary in Ho Chi Minh City for visitors, with honest place data, a "show to driver" card, and in-app reporting of wrong info.

Prototype v1 · HIST 2026 project.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The finished app in one file. Open it in a browser. **Generated, do not edit by hand.** |
| `app.template.html` | The app's page and design. Edit this, then rebuild. |
| `engine.js` | The itinerary planner (pure JavaScript, no internet needed). |
| `places.json` | The 15 real places. Coordinates and visit minutes are still empty on purpose. |
| `fake.js` | Fictional test places, used only for the clearly labelled preview and the tests. |
| `build.py` | Puts `places.json`, `engine.js` and `fake.js` into `app.template.html` to make `index.html`. |
| `tests/engine.test.js` | Automatic tests for the planner. |
| `pitch-deck/` | HIST 2026 pitch deck (PDF, PowerPoint, and the files that build them). |

## Run the app

Download or clone the repo, then double-click `index.html` to open it in your browser. Nothing to install.

## Build after a change

Needs Python 3.

```bash
python3 build.py
```

This rewrites `index.html`. Commit both the file you changed and the new `index.html`.

## Test

Needs Node.js.

```bash
node tests/engine.test.js
```

You should see `10 passed`.

## Why no real plan appears yet

The planner needs at least 8 places with verified data. To turn on real plans, fill in `lat`, `lng`, `coords_source`, `typical_visit_minutes` and `visit_minutes_source` for at least 8 places in `places.json`, then rebuild. Until then the app honestly says there is not enough data, and offers a fictional preview instead.

## Note on saved reports and surveys

"Report wrong info" and survey answers are saved only when the app runs as the published Claude artifact. When `index.html` is opened from a file or another website, the app still works but those answers are not saved.
