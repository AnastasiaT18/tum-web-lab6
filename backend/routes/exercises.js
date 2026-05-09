const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');


/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises and their muscles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Paginated list of workouts
 *       401:
 *         description: No token provided
 *       403:
 *         description: Insufficient permissions
 */


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

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Get an exercise by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise object
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */


// GET /api/exercises/:id → list ONE exercise
router.get('/:id', auth('VISITOR'), (req, res) => {
    
    const exercise = db.prepare(`
        SELECT e.id, e.name, GROUP_CONCAT(em.muscle_id) as muscles
        FROM exercises e
        LEFT JOIN exercise_muscles em ON e.id = em.exercise_id
        WHERE e.id = ?
        GROUP BY e.id`).get(req.params.id);

    if (!exercise || !exercise.id) {
        return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({
        ...exercise,
        muscles: exercise.muscles ? exercise.muscles.split(',') : []
    });


});


/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create a new exercise
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - muscles
 *             properties:
 *               id:
 *                 type: string
 *                 example: "handstand"
 *               name:
 *                 type: string
 *                 example: "Handstand"
 *               muscles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["deltoids", "triceps", "abs"]
 *     responses:
 *       201:
 *         description: Created exercise
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Exercise with given ID or name already exists
 */


// POST /api/exercises — create custom exercise (ADMIN only)
router.post('/', auth('ADMIN'), (req,res)=>{

    const {id, name, muscles} = req.body;

    if (!id || !name || !muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingId = db.prepare('SELECT id FROM exercises WHERE id = ?').get(id);
    if (existingId) {
        return res.status(409).json({ message: `Exercise with id '${id}' already exists` });
    }

    const existingName = db.prepare('SELECT name FROM exercises WHERE name = ?').get(name);
    if (existingName) {
        return res.status(409).json({ message: `Exercise with name '${name}' already exists` });
    }

    const invalidMuscle = muscles.find(muscleId => {
        const muscleExists = db.prepare('SELECT id FROM muscles WHERE id = ?').get(muscleId);
        return !muscleExists;
    });

    if (invalidMuscle) {
        return res.status(400).json({ message: `Muscle '${invalidMuscle}' does not exist` });
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


/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

//DELETE
router.delete('/:id', auth('ADMIN'), (req,res)=>{
    const result = db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Exercise not found' });
    res.status(204).send();
});


module.exports = router;