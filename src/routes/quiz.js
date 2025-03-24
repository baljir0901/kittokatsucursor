const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// Generate a new quiz
router.get('/generate/:chapterId', auth, async (req, res) => {
    try {
        const quiz = await Quiz.generateQuiz(req.user.id, req.params.chapterId);
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz score
router.post('/submit', auth, async (req, res) => {
    try {
        const { score } = req.body;
        const result = await Quiz.saveQuizScore(req.user.id, score);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get weekly rankings
router.get('/rankings', async (req, res) => {
    try {
        const rankings = await Quiz.getWeeklyRankings();
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 