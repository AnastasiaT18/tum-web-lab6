const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


const SALT_ROUNDS = 10;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created, returns JWT
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try{
        const emailExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, hashedPassword]);
        const user = result.rows[0];

        const token = jwt.sign(
            {userId: user.id, email: user.email}, 
            process.env.JWT_SECRET, {expiresIn: '7d'});
        
        res.status(201).json({ token, user: { id: user.id, email: user.email, createdAt: user.created_at } });
    
    }catch(err){
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

});



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token and user info
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req, res) => { 

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email}, 
            process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({ token, user: { id: user.id, email: user.email} });
    }catch(err){
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

});


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user info
 *       401:
 *         description: No token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', auth(), async (req,res) => {
    try{
        const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [req.user.userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);

    }catch(err){
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})



module.exports = router;