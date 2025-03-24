const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const auth = require('../middleware/auth');

// Get specific lesson
router.get('/:id', auth, async (req, res) => {
    try {
        const lesson = await Lesson.getLesson(req.params.id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Check chapter access
        const accessQuery = `
            SELECT c.is_free, ca.id as access_id
            FROM lessons l
            JOIN chapters c ON c.id = l.chapter_id
            LEFT JOIN chapter_access ca ON ca.chapter_id = c.id AND ca.user_id = $1
            WHERE l.id = $2
        `;
        const accessResult = await pool.query(accessQuery, [req.user.id, req.params.id]);
        
        if (!accessResult.rows[0].is_free && !accessResult.rows[0].access_id) {
            return res.status(403).json({ error: 'No access to this lesson' });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 