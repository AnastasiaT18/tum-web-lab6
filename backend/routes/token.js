const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/token', (req, res) => {

    const {role} = req.body;

    if (!role || !['ADMIN', 'VISITOR'].includes(role)){
        return res.status(400).json({error: 'Role must be either ADMIN or VISITOR'});
    }

    const token = jwt.sign({role}, process.env.JWT_SECRET, {expiresIn: '1m'});
    console.log('Generated token:', token);

    res.json({token});

}
);

module.exports = router;
