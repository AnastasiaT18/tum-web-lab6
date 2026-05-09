# GainMap — Fitness Tracker

GainMap is a full-stack web app for tracking bodyweight workouts, built with React on the frontend and Node.js + Express on the backend, with a SQLite database.

It lets you log workouts with exercises and per-set rep counts, see which muscles you've trained recently or how intensely they were trained on an interactive anatomical body map, track a weekly workout goal, and browse your history through a calendar heatmap.

**Live app:** https://anastasiat18.github.io/tum-web-lab6/

> **Note:** The live app requires the backend to be running locally. See [Running locally](#running-locally) below.

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
Set a target of 1–7 workout days per week. Progress bar fills and turns green when the goal is hit.

### Activity calendar
Monthly heatmap — green for workout days, grey for rest. Current day is highlighted. Navigate back through past months.

### Custom exercises
Define exercises with a custom name and any combination of muscle groups. Saved to the database and available alongside built-in exercises. Manage and delete custom exercises from the settings panel.

### Light / Dark mode
Toggle via the navbar. Applied by adding/removing the `.dark` class on `<html>`, activating Tailwind's `dark:` variant across all components.

---

## Tech stack

### Frontend
| | |
|---|---|
| React 18 (Vite) | UI framework |
| Tailwind CSS v4 | Styling + dark mode |
| react-muscle-highlighter | SVG anatomical body map |
| dayjs | Date formatting and diffs |
| react-hot-toast | Toast notifications |
| react-tooltip | Hover tooltips |

### Backend
| | |
|---|---|
| Node.js + Express | REST API server |
| better-sqlite3 | SQLite database |
| jsonwebtoken | JWT authentication |
| swagger-ui-express | API documentation |
| dotenv | Environment variables |
| cors | Cross-origin requests |

---

## Project structure

```
tum-web-lab6/
├── gainmap/                  # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx           # Root — state, API calls, layout
│       ├── api.js            # API service layer (all fetch calls)
│       ├── index.css         # Tailwind v4 + custom theme
│       └── components/
│           ├── Navbar.jsx
│           ├── BodyMap.jsx           # Interactive muscle map
│           ├── GoalDisplay.jsx       # Weekly progress bar
│           ├── ActivityCalendar.jsx  # Monthly heatmap
│           ├── RecentWorkouts.jsx    # Workout list with like/delete/filter
│           ├── AddWorkoutModal.jsx   # Add workout + per-set reps
│           ├── WorkoutModal.jsx      # Workout detail + muscle map
│           ├── WorkoutBodyMap.jsx    # Body map for a single workout
│           ├── GoalSettingsModal.jsx
│           └── CustomExerciseForm.jsx
│
└── backend/                  # Backend (Node.js + Express)
    ├── server.js             # Entry point
    ├── db.js                 # SQLite setup and schema
    ├── seed.js               # Seeds built-in exercises and muscles
    ├── import.js             # One-time import from exported JSON
    ├── swagger.js            # Swagger configuration
    ├── middleware/
    │   └── auth.js           # JWT middleware
    └── routes/
        ├── token.js          # POST /api/token
        ├── workouts.js       # CRUD /api/workouts
        ├── exercises.js      # CRUD /api/exercises
        └── muscles.js        # GET /api/muscles
```

---

## Database schema

```
muscles          — lookup table of all muscle names
exercises        — built-in and custom exercises
exercise_muscles — many-to-many: exercise ↔ muscles
workouts         — id, date, liked
workout_exercises — links a workout to an exercise
sets             — set_number and reps per workout_exercise
```

---

## API

The REST API is documented with Swagger UI at `http://localhost:3000/docs` when running locally.

### Authentication
All endpoints require a JWT passed as a Bearer token in the `Authorization` header. Tokens are obtained from `POST /api/token` with a role of `ADMIN` or `VISITOR`.

- `ADMIN` — full CRUD access
- `VISITOR` — read-only access

### Endpoints
```
POST   /api/token              → get a JWT
GET    /api/workouts           → list all workouts (paginated)
GET    /api/workouts/:id       → get one workout
POST   /api/workouts           → create a workout
PATCH  /api/workouts/:id       → update a workout
DELETE /api/workouts/:id       → delete a workout
GET    /api/exercises          → list all exercises (paginated)
GET    /api/exercises/:id      → get one exercise
POST   /api/exercises          → create a custom exercise
DELETE /api/exercises/:id      → delete an exercise
GET    /api/muscles            → list all muscles
```

---

## Running locally

### Backend
```bash
cd backend
npm install
npm run seed      # seed built-in exercises and muscles
npm run dev       # http://localhost:3000
                  # Swagger docs at http://localhost:3000/docs
```

### Frontend
```bash
cd gainmap
npm install
npm run dev       # http://localhost:5173
```

Both servers must be running at the same time for the app to work.