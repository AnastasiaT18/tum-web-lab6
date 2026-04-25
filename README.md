# GainMap — Fitness Tracker

GainMap is a client-side web app for tracking bodyweight workouts, built with React. 
It lets you log workouts with exercises and per-set rep counts, see which muscles you've trained recently or how intensely they were trained on an interactive anatomical body map, track a weekly workout goal, and browse your history through a calendar heatmap.

**Live app:** https://anastasiat18.github.io/tum-web-lab6/

---

## Features

### Workouts (main entity)
- **Add** — pick date/time, select exercises, configure sets and per-set reps
- **Delete** — trash icon with confirmation dialog
- **Like / Unlike** — heart toggle per workout
- **Filter** — by All, Liked, or any muscle group
- **View details** — click any workout to open a detail modal with a per-workout body map
- **Templates** — reuse a past workout's exercise selection when adding a new one

### Per-set rep configuration
Each exercise stores reps as an array (`repsPerSet: [12, 10, 8]`), so every set can have a different rep count. The UI has `+` / `−` buttons to add or remove sets and a "Fill all" shortcut to apply the same value to every set at once.

### Interactive body map
Muscles are colour-coded by how recently they were trained (≤1 day → red, 1–3 days → orange, 3–7 days → yellow, >7 days → grey). Click a muscle to see the last training date. Toggle between Female/Male models and Front/Back views.

### Weekly goal
Set a target of 1–7 workout days per week. Progress bar fills and turns green when the goal is hit. Includes a reset button to clear all app data.

### Activity calendar
Monthly heatmap — green for workout days, grey for rest. Current day is highlighted. Navigate back through past months.

### Custom exercises
Define exercises with a custom name and any combination of muscle groups. Saved to `localStorage` and available alongside built-in exercises.

### Light / Dark mode
Toggle via the navbar. Applied by adding/removing the `.dark` class on `<html>`, activating Tailwind's `dark:` variant across all components.

---

## Tech stack

| | |
|---|---|
| React 18 (Vite) | UI framework |
| Tailwind CSS v4 | Styling + dark mode |
| react-muscle-highlighter | SVG anatomical body map |
| dayjs | Date formatting and diffs |
| react-hot-toast | Toast notifications |
| react-tooltip | Hover tooltips |
| localStorage | Persisting workouts, goal, custom exercises |

---

## Project structure

```
src/
├── App.jsx                   # Root — state, localStorage, layout
├── index.css                 # Tailwind v4 + custom theme
├── components/
│   ├── Navbar.jsx
│   ├── BodyMap.jsx           # Interactive muscle map
│   ├── GoalDisplay.jsx       # Weekly progress bar
│   ├── ActivityCalendar.jsx  # Monthly heatmap
│   ├── RecentWorkouts.jsx    # Workout list with like/delete/filter
│   ├── AddWorkoutModal.jsx   # Add workout + per-set reps
│   ├── WorkoutModal.jsx      # Workout detail + muscle map
│   ├── WorkoutBodyMap.jsx    # Body map for a single workout
│   ├── GoalSettingsModal.jsx
│   ├── CustomExerciseForm.jsx
│   
└── data/
    └── exercises.js          # Built-in exercise definitions
```

---

## Data model

```js
// Workout
{
  id: "1714900000000",       // Date.now() string
  date: "2025-04-25T10:30", // datetime-local string
  liked: false,
  exercises: [
    {
      exerciseId:   "pushups",
      exerciseName: "Push-ups",
      muscles:      ["chest", "triceps", "deltoids"],
      repsPerSet:   [12, 10, 8],  // one entry per set
    }
  ]
}
```

---

## Running locally

```bash
git clone https://github.com/your-username/gainmap.git
cd gainmap
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build
npm run deploy     # deploy to GitHub Pages (gh-pages package)
```

---

## State & persistence

All state lives in `App.jsx` and is passed down as props. Each persisted slice (`workouts`, `weeklyGoal`, `customExercises`) has a `useEffect` that writes to `localStorage` on change. Initial values are read with a lazy initializer (arrow function in `useState`) wrapped in `try/catch` so corrupted storage never crashes the app.