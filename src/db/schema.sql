-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    is_free BOOLEAN DEFAULT false
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id),
    lesson_number INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    audio_url VARCHAR(255),
    vocabulary_list JSONB
);

-- Quiz Scores table
CREATE TABLE quiz_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    score INTEGER NOT NULL,
    quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapter Access table
CREATE TABLE chapter_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    chapter_id INTEGER REFERENCES chapters(id),
    granted_by INTEGER REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 