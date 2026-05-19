const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS muscles (
            id TEXT PRIMARY KEY,    
            name TEXT NOT NULL     
            );

            CREATE TABLE IF NOT EXISTS exercises (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS exercise_muscles (
                exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
                muscle_id TEXT NOT NULL REFERENCES muscles(id) ON DELETE CASCADE,
                PRIMARY KEY (exercise_id, muscle_id)
            );

            CREATE TABLE IF NOT EXISTS workouts (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                liked INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS workout_exercises (
                id SERIAL PRIMARY KEY,
                workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
                exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS sets (
                id SERIAL PRIMARY KEY,
                workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
                set_number INTEGER NOT NULL,
                reps INTEGER NOT NULL
            );
        `);
        console.log('Tables created successfully');
};

createTables().catch(err => console.error('Error creating tables:', err));

module.exports = pool;