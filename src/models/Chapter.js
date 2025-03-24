const pool = require('../config/database');

class Chapter {
    static async getAll() {
        const query = 'SELECT * FROM chapters ORDER BY chapter_number';
        const result = await pool.query(query);
        return result.rows;
    }

    static async getFreeChapters() {
        const query = 'SELECT * FROM chapters WHERE is_free = true ORDER BY chapter_number';
        const result = await pool.query(query);
        return result.rows;
    }

    static async getChapterWithLessons(chapterId) {
        const chapterQuery = 'SELECT * FROM chapters WHERE id = $1';
        const lessonsQuery = 'SELECT * FROM lessons WHERE chapter_id = $1 ORDER BY lesson_number';
        
        const chapter = await pool.query(chapterQuery, [chapterId]);
        const lessons = await pool.query(lessonsQuery, [chapterId]);
        
        return {
            ...chapter.rows[0],
            lessons: lessons.rows
        };
    }
}

module.exports = Chapter; 