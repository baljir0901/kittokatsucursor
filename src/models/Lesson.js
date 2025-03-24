const pool = require('../config/database');

class Lesson {
    static async getLesson(lessonId) {
        const query = 'SELECT * FROM lessons WHERE id = $1';
        const result = await pool.query(query, [lessonId]);
        return result.rows[0];
    }

    static async getLessonVocabulary(lessonId) {
        const query = 'SELECT vocabulary_list FROM lessons WHERE id = $1';
        const result = await pool.query(query, [lessonId]);
        return result.rows[0]?.vocabulary_list || [];
    }
}

module.exports = Lesson; 