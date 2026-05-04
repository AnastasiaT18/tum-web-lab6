const Database = require('better-sqlite3');
const db = new Database('gainmap.db');

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        liked INTEGER DEFAULT 0,
        exercises TEXT NOT NULL
        );

    CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        muscles TEXT NOT NULL
    );

    `);

module.exports = db;