const csv = require('csv-parser');
const https = require('https');
const { Pool } = require('pg');
const pool = require('../config/database');

async function importChaptersAndLessons() {
    try {
        // Convert Dropbox share link to direct download link
        const dropboxLink = 'https://www.dropbox.com/scl/fo/23ne0fzz0i1f6an1qd1ay/AOZ7xWV4UEB2SFtfggDUGx8?rlkey=jmwvwtb4apkk60kpzr1pd7ve7&st=ma51xdix&dl=0';
        const directLink = dropboxLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com');

        // First, clear existing data
        await pool.query('TRUNCATE chapters CASCADE');
        await pool.query('TRUNCATE lessons CASCADE');

        https.get(directLink, (response) => {
            response
                .pipe(csv())
                .on('data', async (row) => {
                    try {
                        // Insert chapter if it doesn't exist
                        const chapterResult = await pool.query(
                            `INSERT INTO chapters (chapter_number, title, is_free) 
                             VALUES ($1, $2, $3) 
                             ON CONFLICT (chapter_number) DO UPDATE 
                             SET title = EXCLUDED.title 
                             RETURNING id`,
                            [row.chapter_number, row.chapter_title, row.chapter_number <= 3]
                        );

                        // Insert lesson
                        await pool.query(
                            `INSERT INTO lessons 
                             (chapter_id, lesson_number, title, vocabulary_list) 
                             VALUES ($1, $2, $3, $4)`,
                            [
                                chapterResult.rows[0].id,
                                row.lesson_number,
                                row.lesson_title,
                                JSON.stringify(row.vocabulary_list)
                            ]
                        );

                        console.log(`Imported: Chapter ${row.chapter_number}, Lesson ${row.lesson_number}`);
                    } catch (error) {
                        console.error('Error importing row:', error);
                    }
                })
                .on('end', () => {
                    console.log('Import completed');
                    pool.end();
                });
        });
    } catch (error) {
        console.error('Error in import:', error);
    }
}

importChaptersAndLessons(); 