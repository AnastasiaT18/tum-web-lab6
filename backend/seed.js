const db = require('./db');

const exercises = [
  // Push
  { id: "pushups", name: "Push-ups", muscles: ["chest", "triceps", "deltoids"] },
  { id: "dips", name: "Dips", muscles: ["triceps", "chest", "deltoids"] },
  { id: "pikepushups", name: "Pike Push-ups", muscles: ["deltoids", "triceps"] },

  // Pull
  { id: "pullups", name: "Pull-ups", muscles: ["upper-back", "biceps", "forearm"] },
  { id: "chinups", name: "Chin-ups", muscles: ["biceps", "upper-back", "forearm"] },

  // Legs
  { id: "squats", name: "Squats", muscles: ["quadriceps", "gluteal", "hamstring"] },
  { id: "lunges", name: "Lunges", muscles: ["quadriceps", "gluteal", "hamstring", "adductors"] },
  { id: "glutebridges", name: "Glute Bridges", muscles: ["gluteal", "hamstring", "lower-back"] },
  { id: "calfraises", name: "Calf Raises", muscles: ["calves"] },
  { id: "sumoSquats", name: "Sumo Squats", muscles: ["adductors", "quadriceps", "gluteal"] },
  { id: "toeraises", name: "Toe Raises", muscles: ["tibialis"] },
  { id: "sidelunges", name: "Side Lunges", muscles: ["adductors", "quadriceps", "gluteal"] },
  { id: "bulgariansplitsquat", name: "Bulgarian Split Squat", muscles: ["quadriceps", "gluteal", "hamstring", "adductors"] },
  { id: "pistolsquat", name: "Pistol Squat", muscles: ["quadriceps", "gluteal", "hamstring", "adductors"] },
  { id: "stepups", name: "Step-ups", muscles: ["quadriceps", "gluteal", "hamstring"] },

  // Core
  { id: "plank", name: "Plank", muscles: ["abs", "obliques"] },
  { id: "sideplank", name: "Side Plank", muscles: ["obliques", "abs"] },
  { id: "legraises", name: "Leg Raises", muscles: ["abs", "quadriceps"] },
  { id: "russiantwists", name: "Russian Twists", muscles: ["obliques", "abs"] },

  // Full body
  { id: "deadlift", name: "Deadlift", muscles: ["lower-back", "hamstring", "gluteal", "trapezius"] },
  { id: "burpees", name: "Burpees", muscles: ["chest", "triceps", "quadriceps", "abs"] },
];

const allMuscleIds = [...new Set(exercises.flatMap(e => e.muscles))];

// Example workouts
const workouts = [
  {
    id: "seed-workout-1",
    date: "2026-04-24T18:30",
    liked: 0,
    exercises: [
      { exerciseId: "pullups", repsPerSet: [10, 10] },
      { exerciseId: "chinups", repsPerSet: [10, 8] },
      { exerciseId: "dips",    repsPerSet: [15, 15] },
    ]
  },
  {
    id: "seed-workout-2",
    date: "2026-04-22T15:30",
    liked: 1,
    exercises: [
      { exerciseId: "bulgariansplitsquat", repsPerSet: [10, 10, 10] },
      { exerciseId: "glutebridges",        repsPerSet: [15, 15] },
      { exerciseId: "pistolsquat",         repsPerSet: [8, 8] },
    ]
  },
  {
    id: "seed-workout-3",
    date: "2026-04-21T09:30",
    liked: 0,
    exercises: [
      { exerciseId: "plank",         repsPerSet: [1, 1, 1] },
      { exerciseId: "legraises",     repsPerSet: [15, 12] },
      { exerciseId: "russiantwists", repsPerSet: [20, 20] },
    ]
  },
];


const seedAll = db.transaction(() => {
  //Seed muscles
  const insertMuscle = db.prepare('INSERT OR IGNORE INTO muscles (id, name) VALUES (?, ?)');

  allMuscleIds.forEach(muscleId => {
    insertMuscle.run(muscleId, muscleId.charAt(0).toUpperCase() + muscleId.slice(1));
  }); 

  //Seed exercises
  const insertExercises = db.prepare('INSERT OR IGNORE INTO exercises (id, name) VALUES (?, ?)');

  exercises.forEach(ex=>{
    insertExercises.run(ex.id, ex.name);
  })

  //Seed exercise_muscles join table
  const insertExerciseMuscle = db.prepare('INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)');

  exercises.forEach(ex=>{
    ex.muscles.forEach(muscleId => {
      insertExerciseMuscle.run(ex.id, muscleId);
    })
  })

  //Seed workouts
  const insertWorkout = db.prepare('INSERT OR IGNORE INTO workouts (id, date, liked) VALUES (?, ?, ?)');

  const insertWorkoutExercises = db.prepare('INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)');

  const insertSet = db.prepare('INSERT INTO sets (workout_exercise_id, set_number, reps) VALUES (?, ?, ?)');

  workouts.forEach(workout=>{
    const exists = db.prepare('SELECT id FROM workouts WHERE id = ?').get(workout.id);
    if (exists) return;

    insertWorkout.run(workout.id, workout.date, workout.liked);

    workout.exercises.forEach(ex=>{
      const { lastInsertRowid } = insertWorkoutExercises.run(workout.id, ex.exerciseId);
    
      ex.repsPerSet.forEach((reps, index) => {
        insertSet.run(lastInsertRowid, index + 1, reps);
    
    });
  });

});

});

seedAll();
console.log('Seeded exercises and workouts successfully');