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

const insert = db.prepare(`
  INSERT OR IGNORE INTO exercises (id, name, muscles)
  VALUES (@id, @name, @muscles)
`);

const seedAll = db.transaction(() => {
  for (const exercise of exercises) {
    insert.run({
      id: exercise.id,
      name: exercise.name,
      muscles: JSON.stringify(exercise.muscles)
    });
  }
});

seedAll();
console.log('Seeded exercises successfully');