const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const auth = require('../middleware/auth');

// Get all chapters (with access status for logged-in user)
router.get('/', auth, async (req, res) => {
    try {
        const chapters = await Chapter.getAll();
        const accessQuery = `
            SELECT chapter_id FROM chapter_access 
            WHERE user_id = $1
        `;
        const accessResult = await pool.query(accessQuery, [req.user.id]);
        const accessedChapters = new Set(accessResult.rows.map(row => row.chapter_id));

        const chaptersWithAccess = chapters.map(chapter => ({
            ...chapter,
            hasAccess: chapter.is_free || accessedChapters.has(chapter.id)
        }));

        res.json(chaptersWithAccess);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific chapter with lessons
router.get('/:id', auth, async (req, res) => {
    try {
        const chapter = await Chapter.getChapterWithLessons(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Check access
        if (!chapter.is_free) {
            const accessQuery = `
                SELECT id FROM chapter_access 
                WHERE user_id = $1 AND chapter_id = $2
            `;
            const accessResult = await pool.query(accessQuery, [req.user.id, req.params.id]);
            if (!accessResult.rows.length) {
                return res.status(403).json({ error: 'No access to this chapter' });
            }
        }

        res.json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 