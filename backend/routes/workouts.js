const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


async function getWorkoutbyId(id){
    const workoutResult = await pool.query('SELECT * FROM workouts WHERE id = $1', [id]);
    
    const workout = workoutResult.rows[0];
    if (!workout) return null;

    const rowsResult = await pool.query(`
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
        WHERE we.workout_id = $1
        ORDER BY we.id, s.set_number`, [id]);

    const rows = rowsResult.rows;

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
            liked: workout.liked,
            userId: workout.user_id,
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
 *       500:
 *         description: Internal server error
 */

//GET    /api/workouts        → list all (VISITOR or ADMIN), with pagination
router.get('/', auth(), async (req,res) =>{

    try{
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const workoutsResult = await pool.query('SELECT * FROM workouts WHERE user_id = $1 LIMIT $2 OFFSET $3', [req.user.userId, limit, offset]);
    
        const totalResults = await pool.query('SELECT COUNT(*) as count FROM workouts WHERE user_id = $1', [req.user.userId]);
        const total = parseInt(totalResults.rows[0].count);

        const data = await Promise.all(workoutsResult.rows.map(w => getWorkoutbyId(w.id)));

        res.json({data, total, limit, offset})
    }catch(err){
        console.error('Error fetching workouts:', err);
        res.status(500).json({error: 'Internal server error'});
    }

});

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
 *       500:
 *         description: Internal server error
 */

// GET    /api/workouts/:id    → get one (VISITOR or ADMIN)
router.get('/:id', auth(), async (req,res) =>{

    try{
        const workout = await getWorkoutbyId(req.params.id);

        if (!workout){
            return res.status(404).json({error: 'Workout not found'})
        }

        if (workout.userId !== req.user.userId){
            return res.status(403).json({error: 'Insufficient permissions'})
        }

        res.json(workout);
    }
    catch(err){
        console.error('Error fetching workout:', err);
        res.status(500).json({error: 'Internal server error'});
    }
    
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
 *       500:
 *         description: Internal server error
 */


// POST   /api/workouts        → create (ADMIN only)
router.post('/', auth(), async (req,res) =>{

    const {id, date, exercises} = req.body;

    if (!id || !date || !exercises){
        return res.status(400).json({error: 'Missing or invalid fields'})
    }

    const client = await pool.connect();

    try{

        await client.query('BEGIN');   

        // Validate exercises
        for (const ex of exercises){
            const result = await client.query('SELECT id FROM exercises WHERE id = $1', [ex.exerciseId]);
        
            if (result.rowCount === 0){
                await client.query('ROLLBACK');
                return res.status(400).json({error: `Exercise with id ${ex.exerciseId} does not exist`});
            }
        }

        await client.query('INSERT INTO workouts (id, date, liked, user_id) VALUES ($1, $2, 0, $3)', [id, date, req.user.userId]);

        for (const ex of exercises){
            const weResult = await client.query('INSERT INTO workout_exercises (workout_id, exercise_id) VALUES ($1, $2) RETURNING id', [id, ex.exerciseId]);
            const workoutExerciseId = weResult.rows[0].id;

            for (let i = 0; i < ex.repsPerSet.length; i++){
                await client.query('INSERT INTO sets (workout_exercise_id, set_number, reps) VALUES ($1, $2, $3)', [workoutExerciseId, i + 1, ex.repsPerSet[i]]);
            }
        }

        await client.query('COMMIT');

        const saved = await getWorkoutbyId(id);
        res.status(201).json(saved);

    }catch(err){
        await client.query('ROLLBACK');
        console.error('Error creating workout:', err);
        res.status(500).json({error: 'Internal server error'});  
    }finally{
        client.release();
    }
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
 *       500:
 *         description: Internal server error
 */

// DELETE /api/workouts/:id    → delete (ADMIN only)
router.delete('/:id', auth(), async (req,res)=>{
    try{
        const check = await pool.query('SELECT user_id FROM workouts WHERE id = $1', [req.params.id]);

        if (check.rowCount === 0){
            return res.status(404).json({error: 'Workout not found'})
        }

        if (check.rows[0].user_id !== req.user.userId){
            return res.status(403).json({error: 'Insufficient permissions'})
        }

        await pool.query('DELETE FROM workouts WHERE id = $1', [req.params.id]);
        res.status(204).send();
    }catch(err){
        console.error('Error deleting workout:', err);
        res.status(500).json({error: 'Internal server error'});  
    }
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
 *       500:
 *         description: Internal server error
 */

// PATCH  /api/workouts/:id/like → toggle like (ADMIN only)
router.patch('/:id', auth(), async (req,res)=>{

    try{
        const check = await pool.query('SELECT user_id FROM workouts WHERE id = $1', [req.params.id]);

        if (check.rowCount === 0){
            return res.status(404).json({error: 'Workout not found'})
        }

        if (check.rows[0].user_id !== req.user.userId){
            return res.status(403).json({error: 'Insufficient permissions'})
        }

        if(req.body.liked !== undefined){
            await pool.query('UPDATE workouts SET liked = $1 WHERE id = $2', [req.body.liked, req.params.id]);
        }

        const updated = await getWorkoutbyId(req.params.id);
        res.json(updated);

    }catch(err){
        console.error('Error updating workout:', err);
        res.status(500).json({error: 'Internal server error'});
    }

});

module.exports = router;
