require('dotenv').config();

const pool = require('./db');

const data = require('./sqlite-export.json');

const {workouts, muscles, exercises, exerciseMuscles, workoutExercises, sets} = data;

const importData = async () => {

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        for (const muscle of muscles){
            await client.query('INSERT INTO muscles (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING', [muscle.id, muscle.name]);
        }
        console.log(`${muscles.length} muscles imported`);

        for (const exercise of exercises){
            await client.query('INSERT INTO exercises (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING', [exercise.id, exercise.name]);
        }
        console.log(`${exercises.length} exercises imported`);


        for (const em of exerciseMuscles){
            await client.query('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES ($1, $2) ON CONFLICT DO NOTHING ', [em.exercise_id, em.muscle_id]);
        }
        console.log(`Inserted ${exerciseMuscles.length} exercise-muscle links`);


        for (const workout of workouts){
            await client.query('INSERT INTO workouts (id, date, liked) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [workout.id, workout.date, workout.liked]);
        }
        console.log(`Inserted ${workouts.length} workouts`);


        const idMap = {};
        for (const we of workoutExercises){
            const result = await client.query('INSERT INTO workout_exercises (workout_id, exercise_id) VALUES ($1, $2) RETURNING id',
                [we.workout_id, we.exercise_id]);
                idMap[we.id] =  result.rows[0].id; 
        }
        console.log(`Inserted ${workoutExercises.length} workout exercises`);


        for (const set of sets){
            const newId = idMap[set.workout_exercise_id];
            if (!newId) continue;
            await client.query('INSERT INTO sets (workout_exercise_id, set_number, reps) VALUES ($1, $2, $3)', 
                [newId, set.set_number, set.reps]);
        }
        console.log(`Inserted ${sets.length} sets`);

        await client.query('COMMIT');
        console.log('Data imported successfully!');
        console.log('Import complete!');
    }catch(err){
        await client.query('ROLLBACK');
        console.error('Import failed, rolled back:', err);
    }finally{
        client.release();
    }
    
}

importData();