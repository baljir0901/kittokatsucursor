const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// Get all chapters with their lessons
router.get('/content', auth, async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id as chapter_id,
                c.chapter_number,
                c.title as chapter_title,
                c.is_free,
                json_agg(
                    json_build_object(
                        'lesson_id', l.id,
                        'lesson_number', l.lesson_number,
                        'title', l.title,
                        'vocabulary_list', l.vocabulary_list
                    ) ORDER BY l.lesson_number
                ) as lessons
            FROM chapters c
            LEFT JOIN lessons l ON c.id = l.chapter_id
            GROUP BY c.id, c.chapter_number
            ORDER BY c.chapter_number;
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 