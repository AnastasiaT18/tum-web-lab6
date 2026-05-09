const express = require('express');
const router = express.Router();
const db = require('../db');
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
 */


router.get('/', auth('VISITOR'), (req, res) => {
    const muscles = db.prepare('SELECT * FROM muscles').all();
    res.json({
        data: muscles.map(m => ({
            id: m.id,
            name: m.name
        }))
    });
});

module.exports = router;