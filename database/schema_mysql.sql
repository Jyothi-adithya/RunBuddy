-- =============================================
-- RunBuddy MySQL Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS runbuddy_db;
USE runbuddy_db;

-- Recreate schema cleanly so seed IDs are deterministic on every run
DROP TABLE IF EXISTS blocked_users;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS request_responses;
DROP TABLE IF EXISTS partner_requests;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    verified BOOLEAN DEFAULT FALSE,
    fcm_token VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Profiles table
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    gender VARCHAR(10) DEFAULT NULL,
    profile_photo_url VARCHAR(255) DEFAULT NULL,
    running_level VARCHAR(20) DEFAULT NULL,
    average_pace DECIMAL(5,2) DEFAULT NULL,
    preferred_distance DECIMAL(5,2) DEFAULT NULL,
    availability JSON DEFAULT NULL,
    location POINT SRID 4326 NOT NULL,               -- MySQL spatial column (required for SPATIAL index)
    privacy_level VARCHAR(20) DEFAULT 'APPROXIMATE',
    emergency_contact VARCHAR(100) DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Spatial index for fast location queries
ALTER TABLE profiles ADD SPATIAL INDEX idx_profiles_location (location);

-- Partner Requests table
CREATE TABLE partner_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date_time DATETIME NOT NULL,
    distance DECIMAL(5,2) NOT NULL,
    pace DECIMAL(5,2) NOT NULL,
    meeting_location POINT SRID 4326 NOT NULL,
    notes TEXT DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Spatial index for meeting location
ALTER TABLE partner_requests ADD SPATIAL INDEX idx_requests_location (meeting_location);

-- Request Responses table
CREATE TABLE request_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    responder_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (request_id) REFERENCES partner_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Messages table
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Blocked users table
CREATE TABLE blocked_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blocker_id BIGINT NOT NULL,
    blocked_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_block (blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- 1. Users (all sample users use BCrypt hash for password123)
INSERT INTO users (username, email, password, role, verified, fcm_token, created_at) VALUES
('john_doe',      'john@example.com',   '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('jane_runner',   'jane@example.com',   '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('mike_fast',     'mike@example.com',   '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('sara_beginner', 'sara@example.com',   '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW());

-- 2. Profiles (linked to users above)
INSERT INTO profiles (user_id, full_name, date_of_birth, gender, profile_photo_url, running_level, average_pace, preferred_distance, availability, location, privacy_level, emergency_contact) VALUES
(1, 'John Doe',       '1995-03-15', 'MALE',   'https://example.com/john.jpg',   'INTERMEDIATE', 5.50, 10.0, '{"monday":"morning","wednesday":"evening"}', ST_PointFromText('POINT(77.5946 12.9716)', 4326), 'APPROXIMATE', '+91 98765 43210'),
(2, 'Jane Runner',    '1992-07-22', 'FEMALE', 'https://example.com/jane.jpg',   'ADVANCED',     4.80, 15.0, '{"tuesday":"morning","thursday":"evening"}', ST_PointFromText('POINT(77.5950 12.9720)', 4326), 'EXACT', '+91 87654 32109'),
(3, 'Mike Fast',      '1988-11-10', 'MALE',   'https://example.com/mike.jpg',   'ADVANCED',     4.20, 12.0, '{"friday":"evening","saturday":"morning"}', ST_PointFromText('POINT(77.6000 12.9800)', 4326), 'APPROXIMATE', '+91 76543 21098'),
(4, 'Sara Beginner',  '2000-05-05', 'FEMALE', 'https://example.com/sara.jpg',   'BEGINNER',     7.00, 5.0,  '{"sunday":"morning"}', ST_PointFromText('POINT(77.5800 12.9600)', 4326), 'APPROXIMATE', '+91 65432 10987');

-- 3. Partner Requests (some open, some closed)
INSERT INTO partner_requests (user_id, date_time, distance, pace, meeting_location, notes, status, created_at) VALUES
(1, '2026-03-25 07:00:00', 10.0, 5.5, ST_PointFromText('POINT(77.5946 12.9716)', 4326), 'Morning run near Cubbon Park', 'OPEN', NOW()),
(2, '2026-03-24 18:30:00', 8.0,  4.9, ST_PointFromText('POINT(77.5950 12.9720)', 4326), 'Evening tempo run', 'OPEN', NOW()),
(3, '2026-03-26 06:30:00', 12.0, 4.3, ST_PointFromText('POINT(77.6000 12.9800)', 4326), 'Long slow distance – all welcome', 'OPEN', NOW()),
(1, '2026-03-20 07:30:00', 7.0,  5.8, ST_PointFromText('POINT(77.5940 12.9700)', 4326), 'Past run – for testing', 'CLOSED', NOW());

-- 4. Request Responses (some pending, some accepted/rejected)
INSERT INTO request_responses (request_id, responder_id, status, created_at) VALUES
(1, 2, 'ACCEPTED', NOW()),
(1, 3, 'PENDING',  NOW()),
(2, 1, 'REJECTED', NOW()),
(3, 4, 'ACCEPTED', NOW());

-- 5. Sample Messages (between John & Jane after acceptance)
INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES
(1, 2, 'Hey Jane, excited for tomorrow morning?', NOW()),
(2, 1, 'Yes! See you at 7 near the gate 🚀', NOW() - INTERVAL 5 MINUTE),
(1, 2, 'Perfect, I’ll bring water too', NOW() - INTERVAL 3 MINUTE);

-- 6. Sample Notifications
INSERT INTO notifications (user_id, content, is_read, timestamp) VALUES
(1, 'Jane accepted your running request!', FALSE, NOW() - INTERVAL 10 MINUTE),
(2, 'Your request to John was accepted. Chat now open!', FALSE, NOW() - INTERVAL 9 MINUTE),
(3, 'You have a new pending response on your request', TRUE, NOW() - INTERVAL 15 MINUTE);

DESCRIBE users;

SELECT id, username, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 20;

SHOW TABLES;
