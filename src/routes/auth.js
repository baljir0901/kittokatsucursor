const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create(username, email, password);
        const token = await User.generateToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) {
            throw new Error('Invalid login credentials');
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid login credentials');
        }
        
        const token = await User.generateToken(user);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 