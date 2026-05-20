const express = require('express');
const router = express.Router();
const pool = require('../db');
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
 *       500:
 *         description: Internal server error
 */


// GET /api/exercises → list all exercises
router.get('/', auth('VISITOR'), async (req, res) => {

    try{
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await pool.query(`
            SELECT e.id, e.name, STRING_AGG(em.muscle_id, ',') as muscles
            FROM exercises e
            LEFT JOIN exercise_muscles em ON e.id = em.exercise_id
            GROUP BY e.id
            LIMIT $1 OFFSET $2`, [limit, offset]);

        const totalResult = await pool.query('SELECT COUNT(*) as count FROM exercises');
        const total = parseInt(totalResult.rows[0].count);

        const data = result.rows.map(ex => ({
            ...ex,
            muscles: ex.muscles ? ex.muscles.split(',') : []
        }));

        res.json({data, total, limit, offset });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
 *       500:
 *         description: Internal server error
 */


// GET /api/exercises/:id → list ONE exercise
router.get('/:id', auth('VISITOR'), async (req, res) => {
    
    try{
        const result = await pool.query(`
            SELECT e.id, e.name, STRING_AGG(em.muscle_id, ',') as muscles
            FROM exercises e
            LEFT JOIN exercise_muscles em ON e.id = em.exercise_id
            WHERE e.id = $1
            GROUP BY e.id`, [req.params.id]);

        const exercise = result.rows[0];
        if (!exercise || !exercise.id) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.json({
            ...exercise,
            muscles: exercise.muscles ? exercise.muscles.split(',') : []
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

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
 *       500:
 *         description: Internal server error
 */


// POST /api/exercises — create custom exercise (ADMIN only)
router.post('/', auth('ADMIN'), async (req,res)=>{

    const {id, name, muscles} = req.body;

    if (!id || !name || !muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const existingId = await client.query('SELECT id FROM exercises WHERE id = $1', [id]);
        if (existingId.rows.length > 0) {
            return res.status(409).json({ message: `Exercise with id '${id}' already exists` });
        }

        const existingName = await client.query('SELECT name FROM exercises WHERE name = $1', [name]);
        if (existingName.rows.length > 0) {
            return res.status(409).json({ message: `Exercise with name '${name}' already exists` });
        }

        for (const m of muscles) {
            resultM = await client.query('SELECT id FROM muscles WHERE id = $1', [m]);
            if (resultM.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Muscle '${m}' does not exist` });
            }
        }

        await client.query('INSERT INTO exercises (id, name) VALUES ($1, $2)', [id, name]);

        for (const m of muscles) {
            await client.query('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES ($1, $2)', [id, m]);
        }

        await client.query('COMMIT');
        res.status(201).json({id, name, muscles});
    }
    catch(err){
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }finally{
        client.release();
    }
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
 *       500:
 *         description: Internal server error
 */

//DELETE
router.delete('/:id', auth('ADMIN'), async (req,res)=>{
    try{
        const result = await pool.query('DELETE FROM exercises WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Exercise not found' });
        res.status(204).send();
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;