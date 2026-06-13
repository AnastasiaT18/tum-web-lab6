# GainMap — Fitness Tracker

A full-stack fitness tracking web app built with React and Node.js. Log bodyweight workouts, visualize trained muscles on an interactive body map, track weekly goals, and access your data from any device. Installable as a PWA on iPhone and Android.

**Live app:** https://anastasiat18.github.io/tum-web-lab6  
**API:** https://tum-web-lab6-production.up.railway.app  
**API Docs:** https://tum-web-lab6-production.up.railway.app/docs  
**Repo:** https://github.com/AnastasiaT18/tum-web-lab6

---

## Features

### Workouts (main entity)
- **Add** — pick date/time, select exercises, configure sets with per-set rep counts
- **Delete** — with confirmation prompt
- **Like / Unlike** — heart toggle per workout
- **Filter** — by All, Liked, or any muscle group
- **View details** — full detail modal with per-workout body map showing muscle intensity
- **Templates** — reuse a past workout's exercise selection

### Per-set rep configuration
Each exercise stores reps as an array (`repsPerSet: [12, 10, 8]`), so every set can have a different rep count. The UI has `+` / `−` buttons to add or remove sets and a "Fill all" shortcut.

### Interactive body map
Front and back anatomical views with muscles colour-coded by how recently they were trained — ≤1 day (red), 1–3 days (orange), 3–7 days (yellow), >7 days (grey). Click any muscle to see the last training date.

### Weekly goal & streak
Set a target of 1–7 workout days per week. Progress bar fills and turns green when the goal is hit. A 🔥 streak counter tracks consecutive weeks where the goal was reached.

### Activity calendar
Monthly heatmap — green for workout days, grey for rest. Navigate back through past months.

### Custom exercises
Define exercises with a custom name and any combination of muscle groups. Stored per user in the database.

### Authentication
- Register and login with email and password
- Passwords hashed with bcrypt (never stored plain)
- JWT access token (15min) + httpOnly refresh token cookie (7 days)
- Token rotation on every refresh
- Each user only sees their own data

### Dark mode
Toggle via navbar. Persisted to localStorage.

### PWA — installable on iPhone
Add to home screen from Safari. Opens without browser bar, feels native.

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
| vite-plugin-pwa | PWA / installable app support |

### Backend
| | |
|---|---|
| Node.js + Express | REST API |
| PostgreSQL (Supabase) | Database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT access + refresh tokens |
| cookie-parser | httpOnly refresh token cookie |
| swagger-ui-express | API documentation |
| Railway | Backend hosting |

---

## Project structure

```
tum-web-lab6/
├── gainmap/                    # React frontend
│   ├── public/
│   │   ├── icons/              # PWA icons (192x192, 512x512)
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api.js              # All API calls in one place
│   │   ├── App.jsx             # Root — state, auth flow, layout
│   │   ├── index.css           # Tailwind v4 + custom theme
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── AuthPage.jsx        # Login / register UI
│   │       ├── BodyMap.jsx         # Interactive muscle map
│   │       ├── GoalDisplay.jsx     # Weekly progress + streak
│   │       ├── ActivityCalendar.jsx
│   │       ├── RecentWorkouts.jsx
│   │       ├── AddWorkoutModal.jsx # Per-set reps UI
│   │       ├── WorkoutModal.jsx
│   │       ├── WorkoutBodyMap.jsx
│   │       ├── GoalSettingsModal.jsx
│   │       └── CustomExerciseForm.jsx
│   └── vite.config.js
│
└── backend/                    # Express API
    ├── routes/
    │   ├── auth.js             # register, login, refresh, logout, /me
    │   ├── workouts.js         # CRUD for workouts
    │   ├── exercises.js        # CRUD for exercises
    │   └── muscles.js          # GET all muscles
    ├── middleware/
    │   └── auth.js             # JWT verification middleware
    ├── migrations/
    ├── db.js                   # PostgreSQL pool + table creation
    ├── seed.js                 # Seed built-in exercises and muscles
    ├── swagger.js              # Swagger config
    └── server.js
```

---

## Database schema

```
users               exercises              muscles
─────────           ─────────              ───────
id (serial)         id (text)              id (text)
email               name                   name
password_hash       user_id → users        
created_at          

exercise_muscles    workouts               workout_exercises      sets
────────────────    ────────               ─────────────────      ────
exercise_id →       id (text)              id (serial)            id (serial)
  exercises         date                   workout_id →           workout_exercise_id →
muscle_id →         liked                    workouts               workout_exercises
  muscles           user_id → users        exercise_id →          set_number
                                             exercises             reps
```

Built-in exercises have `user_id = NULL` and are visible to all users. Custom exercises have a `user_id` and are only visible to their creator.

---

## Auth flow

```
REGISTER / LOGIN
→ bcrypt hashes password
→ JWT access token (15min) returned in response body
→ JWT refresh token (7 days) set as httpOnly cookie

EVERY API CALL
→ access token sent in Authorization header
→ if 401 → call POST /auth/refresh with cookie → get new access token → retry

PAGE REFRESH
→ access token gone from memory
→ app calls POST /auth/refresh on mount
→ cookie still valid → new access token → user stays logged in

LOGOUT
→ server clears cookie
→ access token cleared from memory
→ login page shown
```

---

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get tokens |
| POST | `/api/auth/refresh` | cookie | Get new access token |
| POST | `/api/auth/logout` | — | Clear refresh cookie |
| GET | `/api/auth/me` | ✓ | Get current user info |
| GET | `/api/workouts` | ✓ | List workouts (paginated) |
| GET | `/api/workouts/:id` | ✓ | Get one workout |
| POST | `/api/workouts` | ✓ | Create workout |
| DELETE | `/api/workouts/:id` | ✓ | Delete workout |
| PATCH | `/api/workouts/:id` | ✓ | Update liked status |
| GET | `/api/exercises` | ✓ | List exercises (built-in + own custom) |
| GET | `/api/exercises/:id` | ✓ | Get one exercise |
| POST | `/api/exercises` | ✓ | Create custom exercise |
| DELETE | `/api/exercises/:id` | ✓ | Delete own custom exercise |
| GET | `/api/muscles` | ✓ | List all muscles |

Full interactive docs at `/docs` (Swagger UI).

---

## Running locally

### Frontend
```bash
cd gainmap
npm install
npm run dev        # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET
npm run dev            # http://localhost:3000
```

### Environment variables (backend)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_other_secret
PORT=3000
```

---

## Deployment

- **Frontend** — GitHub Pages via `npm run deploy` (`gh-pages` package)
- **Backend** — Railway (auto-deploys on push to main)
- **Database** — Supabase (PostgreSQL, free tier)

### Install as PWA on iPhone
1. Open Safari → go to the live app URL
2. Tap Share → "Add to Home Screen"
3. Tap Add — appears on home screen like a native app