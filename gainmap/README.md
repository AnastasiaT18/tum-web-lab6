# GainMap 💪

A client-side workout tracking app with an interactive muscle body map.
Log your workouts, visualize which muscles you've trained, and track your consistency over time.

## Features

### Entities (Workouts)
- Add a workout by selecting exercises from a predefined list
- Each exercise automatically maps to the muscles it targets
- Remove workouts from your history
- Like/favorite workouts
- Filter workouts by muscle group or date

### Body Map
- Interactive SVG human body (front/back view)
- Muscles highlight automatically based on logged workouts + INTENSITY WORKED??
- Hover over a muscle to see days since last trained

### Progress & Streaks
- Daily streak counter + REST DAYS (FREEZE OR NOT COUNT)
- Activity heatmap calendar (last 30 days)

### Other
- Light/dark mode
- All data persisted in localStorage (workouts, streak, favorites)
- Fully client-side, no backend
- RESPONSIVE
## Tech Stack
- React + Vite
- Tailwind CSS
- react-body-highlighter
- localStorage

## Hosting
Deployed on GitHub Pages: [link here]