const pool = require('../config/database');

class Quiz {
    static async generateQuiz(userId, chapterId) {
        try {
            // Get all vocabulary from the chapter's lessons
            const query = `
                SELECT l.vocabulary_list
                FROM lessons l
                WHERE l.chapter_id = $1
            `;
            
            const result = await pool.query(query, [chapterId]);
            let allVocabulary = [];
            
            // Combine vocabulary from all lessons
            result.rows.forEach(lesson => {
                if (lesson.vocabulary_list) {
                    allVocabulary = allVocabulary.concat(lesson.vocabulary_list);
                }
            });

            // Randomly select 10 words for the quiz
            const quizWords = this.shuffleArray(allVocabulary).slice(0, 10);
            
            return quizWords;
        } catch (error) {
            throw error;
        }
    }

    static async saveQuizScore(userId, score) {
        const query = `
            INSERT INTO quiz_scores (user_id, score)
            VALUES ($1, $2)
            RETURNING *
        `;
        
        const result = await pool.query(query, [userId, score]);
        return result.rows[0];
    }

    static async getWeeklyRankings() {
        const query = `
            SELECT 
                u.username,
                MAX(qs.score) as best_score
            FROM quiz_scores qs
            JOIN users u ON u.id = qs.user_id
            WHERE qs.quiz_date >= NOW() - INTERVAL '7 days'
            GROUP BY u.id, u.username
            ORDER BY best_score DESC
            LIMIT 10
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = Quiz; 