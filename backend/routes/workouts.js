const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');


function getWorkoutbyId(id){
    const workout = db.prepare('SELECT * FROM workouts WHERE id = ?').get(id);
    if (!workout) return null;

    const rows = db.prepare(`
        SELECT 
            we.id as we_id,
            we.exercise_id,
            e.name as exercise_name,
            em.muscle_id,
            s.set_number,
            s.reps        
        FROM workout_exercises we
        JOIN exercises e on we.exercise_id = e.id
        JOIN exercise_muscles em ON we.exercise_id = em.exercise_id
        JOIN sets s ON we.id = s.workout_exercise_id
        WHERE we.workout_id = ?
        ORDER BY we.id, s.set_number`).all(id);

        const exerciseMap = {};
        for (const row of rows) {
            if (!exerciseMap[row.we_id]) {
            exerciseMap[row.we_id] = {
                exerciseId: row.exercise_id,
                exerciseName: row.exercise_name,
                muscles: [],
                repsPerSet: []
            };
            }

            const ex = exerciseMap[row.we_id];

            if (!ex.muscles.includes(row.muscle_id)) {
                ex.muscles.push(row.muscle_id);
            }

            let setIndex = row.set_number - 1;
            if (ex.repsPerSet[setIndex] === undefined){
                ex.repsPerSet[setIndex] = row.reps;
            }
        }

        return {
            id:workout.id,
            date: workout.date,
            liked: workout.liked === 1,
            exercises: Object.values(exerciseMap)
        };
}

//GET    /api/workouts        → list all (VISITOR or ADMIN), with pagination
router.get('/', auth('VISITOR'), (req,res) =>{

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const workouts = db.prepare('SELECT * FROM workouts LIMIT ? OFFSET ?').all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM workouts').get().count;

    res.json({
        data: workouts.map(w=> getWorkoutbyId(w.id)),
        total,
        limit,
        offset
    })

    //HANDLE ERRORS??

})


// GET    /api/workouts/:id    → get one (VISITOR or ADMIN)
router.get('/:id', auth('VISITOR'), (req,res) =>{

    const workout = getWorkoutbyId(req.params.id);

    if (!workout){
        return res.status(404).json({error: 'Workout not found'})
    }

    res.json(workout);
});


// POST   /api/workouts        → create (ADMIN only)
router.post('/', auth('ADMIN'), (req,res) =>{

    const {id, date, exercises} = req.body;

    if (!id || !date || !exercises){
        return res.status(400).json({error: 'Missing or invalid fields'})
    }

    const save = db.transaction(() => {
        db.prepare('INSERT INTO workouts (id, date, liked)   VALUES (?, ?, 0)').run(id, date);
        
        const insertWorkoutExercises = db.prepare('INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)');

        const insertSet = db.prepare('INSERT INTO sets (workout_exercise_id, set_number, reps) VALUES (?, ?, ?)');

        exercises.forEach(ex => {
            const {lastInsertRowid} = insertWorkoutExercises.run(id, ex.exerciseId);
            
            ex.repsPerSet.forEach((reps, index)=>{
                insertSet.run(lastInsertRowid, index+1, reps);
            }
        );
        });
    });
    
    save();
    res.status(201).json(getWorkoutbyId(id));
});


// DELETE /api/workouts/:id    → delete (ADMIN only)
router.delete('/:id', auth('ADMIN'), (req,res)=>{
    const result = db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Workout not found' });
    res.status(204).send();
});


// PATCH  /api/workouts/:id/like → toggle like (ADMIN only)
router.patch('/:id', auth('ADMIN'), (req,res)=>{
    const workout = getWorkoutbyId(req.params.id);

    if (!workout){
        return res.status(404).json({error: 'Workout not found'})
    }

    if(req.body.liked !== undefined){
        db.prepare('UPDATE workouts SET liked = ? WHERE id = ?').run(req.body.liked ? 1 : 0, req.params.id);
    }

    res.status(200).send();

});

module.exports = router;
