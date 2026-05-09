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

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get a workout by ID
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
 *         description: Workout object
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// GET    /api/workouts/:id    → get one (VISITOR or ADMIN)
router.get('/:id', auth('VISITOR'), (req,res) =>{

    const workout = getWorkoutbyId(req.params.id);

    if (!workout){
        return res.status(404).json({error: 'Workout not found'})
    }

    res.json(workout);
});


/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
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
 *               - date
 *               - exercises
 *             properties:
 *               id:
 *                 type: string
 *                 example: "1777123403805"
 *               date:
 *                 type: string
 *                 example: "2026-04-24T18:30"
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - exerciseId
 *                     - repsPerSet
 *                   properties:
 *                     exerciseId:
 *                       type: string
 *                       example: "pullups"
 *                     repsPerSet:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [10, 10, 8]
 *     responses:
 *       201:
 *         description: Created workout
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */


// POST   /api/workouts        → create (ADMIN only)
router.post('/', auth('ADMIN'), (req,res) =>{

    const {id, date, exercises} = req.body;

    if (!id || !date || !exercises){
        return res.status(400).json({error: 'Missing or invalid fields'})
    }

    const invalidExercise = exercises.find(ex=>
        !db.prepare('SELECT id FROM exercises WHERE id = ?').get(ex.exerciseId))

    if (invalidExercise) return res.status(400).json({error: `Exercise with id ${invalidExercise.exerciseId} does not exist`});


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

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete a workout
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
 *         description: Workout not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// DELETE /api/workouts/:id    → delete (ADMIN only)
router.delete('/:id', auth('ADMIN'), (req,res)=>{
    const result = db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Workout not found' });
    res.status(204).send();
});


/**
 * @swagger
 * /api/workouts/{id}:
 *   patch:
 *     summary: Update liked status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               liked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated workout
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// PATCH  /api/workouts/:id/like → toggle like (ADMIN only)
router.patch('/:id', auth('ADMIN'), (req,res)=>{
    const workout = getWorkoutbyId(req.params.id);

    if (!workout){
        return res.status(404).json({error: 'Workout not found'})
    }

    if(req.body.liked !== undefined){
        db.prepare('UPDATE workouts SET liked = ? WHERE id = ?').run(req.body.liked ? 1 : 0, req.params.id);
    }

    res.json(getWorkoutbyId(req.params.id));

});

module.exports = router;
