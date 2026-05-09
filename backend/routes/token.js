const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VISITOR]
 *     responses:
 *       200:
 *         description: Returns JWT token
 *       400:
 *         description: Invalid role
 */

router.post('/token', (req, res) => {

    const {role} = req.body;

    if (!role || !['ADMIN', 'VISITOR'].includes(role)){
        return res.status(400).json({error: 'Role must be either ADMIN or VISITOR'});
    }

    const token = jwt.sign({role}, process.env.JWT_SECRET, {expiresIn: '1m'});

    res.json({token});

}
);

module.exports = router;
