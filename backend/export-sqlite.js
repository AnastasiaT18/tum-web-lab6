const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('gainmap.db');

const workouts = db.prepare('SELECT * FROM workouts').all();
const workoutExercises = db.prepare('SELECT * FROM workout_exercises').all();
const sets = db.prepare('SELECT * FROM sets').all();
const exercises = db.prepare('SELECT * FROM exercises').all();
const exerciseMuscles = db.prepare('SELECT * FROM exercise_muscles').all();
const muscles = db.prepare('SELECT * FROM muscles').all();

const data = {
    workouts,
    workoutExercises,
    sets,
    exercises,
    exerciseMuscles,
    muscles
};

fs.writeFileSync('./sqlite-export.json', JSON.stringify(data, null, 2));
console.log('Exported successfully!');
console.log(`${workouts.length} workouts, ${exercises.length} exercises, ${sets.length} sets`);