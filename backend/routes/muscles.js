const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');


router.get('/', auth('VISITOR'), (req, res) => {
    const muscles = db.prepare('SELECT * FROM muscles').all();
    res.json(muscles);
});

module.exports = router;