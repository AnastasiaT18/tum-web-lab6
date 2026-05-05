const Database = require('better-sqlite3');
const db = new Database('gainmap.db');

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS muscles (
    id TEXT PRIMARY KEY,    
    name TEXT NOT NULL     
    );

    CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercise_muscles (
        exercise_id TEXT NOT NULL REFERENCES exercises(id),
        muscle_id TEXT NOT NULL REFERENCES muscles(id),
        PRIMARY KEY (exercise_id, muscle_id)
    );

    CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        liked INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
        exercise_id TEXT NOT NULL REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
        set_number INTEGER NOT NULL,
        reps INTEGER NOT NULL
    );

    `);

db.pragma('foreign_keys = ON');

module.exports = db;