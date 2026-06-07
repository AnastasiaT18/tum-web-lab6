const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


/**
 * @swagger
 * /api/muscles:
 *   get:
 *     summary: Get all muscles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated list of muscles
 *       401:
 *         description: No token provided
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Internal server error
 */


router.get('/', auth(), async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM muscles');
        res.json({ data: result.rows});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;