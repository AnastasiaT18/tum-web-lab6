const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/exercises → list all exercises
router.get('/', auth('VISITOR'), (req, res) => {

    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const exercises = db.prepare(`
        SELECT e.id, e.name, GROUP_CONCAT(em.muscle_id) as muscles
        FROM exercises e
        LEFT JOIN exercise_muscles em ON e.id = em.exercise_id
        GROUP BY e.id
        LIMIT ? OFFSET ?`).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM exercises').get().count;

    res.json({
        data: exercises.map(ex=>({
            ...ex,
            muscles: ex.muscles ? ex.muscles.split(',') : []
        })),
        total,
        limit,
        offset
    });
});


// GET /api/exercises/:id → list ONE exercise
router.get('/:id', auth('VISITOR'), (req, res) => {
    
    const exercise = db.prepare(`
        SELECT e.id, e.name, GROUP_CONCAT(em.muscle_id) as muscles
        FROM exercises e
        LEFT JOIN exercise_muscles em ON e.id = em.exercise_id
        WHERE e.id = ?`).get(req.params.id);

    if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({
        ...exercise,
        muscles: exercise.muscles ? exercise.muscles.split(',') : []
    });


});

// POST /api/exercises — create custom exercise (ADMIN only)
router.post('/', auth('ADMIN'), (req,res)=>{

    const {id, name, muscles} = req.body;

    if (!id || !name || !muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertExercise = db.prepare('INSERT INTO exercises (id, name) VALUES (?, ?)');
    const insertExerciseMuscle = db.prepare('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)');

    const save = db.transaction(() => {
        insertExercise.run(id, name);

        muscles.forEach(muscle=>{
            insertExerciseMuscle.run(id, muscle);
        })
    });

    save();
    res.status(201).json({id, name, muscles});

});

//DELETE
router.delete('/:id', auth('ADMIN'), (req,res)=>{
    const result = db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);

    if (result.changes === 0){
        return res.status(404).json({message: 'Exercise not found'});
    }

    res.status(204).send();
});


module.exports = router;