const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateTokens(userId, email){
    const accessToken = jwt.sign(
        {userId, email}, 
        process.env.JWT_SECRET, 
        {expiresIn: ACCESS_TOKEN_EXPIRY});

    const refreshToken = jwt.sign(
        {userId, email}, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: REFRESH_TOKEN_EXPIRY});
    
    return { accessToken, refreshToken };
}

function setRefreshTokenCookie(res, refreshToken){
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,      // JS cannot read this
        secure: true,        // only sent over HTTPS
        sameSite: 'none',    // needed for cross-origin (GitHub Pages → Railway)
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    });
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *         description: User created — returns access token and user info. Sets httpOnly refresh token cookie.
 *       400:
 *         description: Missing fields password too short (min 6 characters)
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
    console.log('body:', req.body); 
    const {email, password} = req.body || {};

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

        const { accessToken, refreshToken } = generateTokens(user.id, user.email);

        setRefreshTokenCookie(res, refreshToken);

        res.status(201).json(
            { accessToken, user: { id: user.id, email: user.email, createdAt: user.created_at } });
    
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
 *     tags: [Auth]
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
 *         description: Login successful — returns access token and user info. Sets httpOnly refresh token cookie.
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req, res) => { 

    const {email, password} = req.body || {};

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

        const { accessToken, refreshToken } = generateTokens(user.id, user.email);

        setRefreshTokenCookie(res, refreshToken);

        res.json({ accessToken, user: { id: user.id, email: user.email} });
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
 *     tags: [Auth]
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


/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Get a new access token using the refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns new access token. Rotates refresh token cookie.
 *       401:
 *         description: No refresh token cookie, or token is invalid/expired
 *       404:
 *         description: User no longer exists
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [decoded.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);

        //rotate refresh token - invalidate old one by setting new cookie
        setRefreshTokenCookie(res, newRefreshToken);
        res.json({ accessToken });
    }catch(err){
        console.error('Error refreshing token:', err);
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out — clears the refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.json({ message: 'Logged out successfully' });
});



module.exports = router;