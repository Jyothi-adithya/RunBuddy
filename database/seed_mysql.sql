USE runbuddy_db;

-- Password for all seeded users is: password123
-- BCrypt hash for password123:
-- $2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou

INSERT INTO users (username, email, password, role, verified, fcm_token, created_at) VALUES
('john_doe', 'john@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('jane_runner', 'jane@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('mike_fast', 'mike@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('sara_beginner', 'sara@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('alex_stride', 'alex@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('priya_pace', 'priya@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('rohan_miles', 'rohan@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('nisha_run', 'nisha@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('karan_sprint', 'karan@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('meera_trail', 'meera@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('vivek_jog', 'vivek@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('anita_longrun', 'anita@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW());

INSERT INTO profiles (user_id, full_name, date_of_birth, gender, profile_photo_url, running_level, average_pace, preferred_distance, availability, location, privacy_level, emergency_contact) VALUES
(1, 'John Doe', '1995-03-15', 'MALE', 'https://example.com/john.jpg', 'INTERMEDIATE', 5.50, 10.0, '{"monday":"morning","wednesday":"evening"}', ST_PointFromText('POINT(77.5946 12.9716)', 4326), 'APPROXIMATE', '+91 9876500001'),
(2, 'Jane Runner', '1992-07-22', 'FEMALE', 'https://example.com/jane.jpg', 'ADVANCED', 4.80, 15.0, '{"tuesday":"morning","thursday":"evening"}', ST_PointFromText('POINT(77.5950 12.9720)', 4326), 'EXACT', '+91 9876500002'),
(3, 'Mike Fast', '1988-11-10', 'MALE', 'https://example.com/mike.jpg', 'ADVANCED', 4.20, 12.0, '{"friday":"evening","saturday":"morning"}', ST_PointFromText('POINT(77.6000 12.9800)', 4326), 'APPROXIMATE', '+91 9876500003'),
(4, 'Sara Beginner', '2000-05-05', 'FEMALE', 'https://example.com/sara.jpg', 'BEGINNER', 7.00, 5.0, '{"sunday":"morning"}', ST_PointFromText('POINT(77.5800 12.9600)', 4326), 'APPROXIMATE', '+91 9876500004'),
(5, 'Alex Stride', '1996-01-18', 'MALE', 'https://example.com/alex.jpg', 'INTERMEDIATE', 5.70, 8.0, '{"monday":"evening","friday":"morning"}', ST_PointFromText('POINT(77.6100 12.9750)', 4326), 'APPROXIMATE', '+91 9876500005'),
(6, 'Priya Pace', '1994-09-09', 'FEMALE', 'https://example.com/priya.jpg', 'ADVANCED', 4.60, 14.0, '{"wednesday":"morning","saturday":"evening"}', ST_PointFromText('POINT(77.6050 12.9680)', 4326), 'EXACT', '+91 9876500006'),
(7, 'Rohan Miles', '1991-04-30', 'MALE', 'https://example.com/rohan.jpg', 'INTERMEDIATE', 5.30, 11.0, '{"tuesday":"evening","thursday":"morning"}', ST_PointFromText('POINT(77.5880 12.9690)', 4326), 'APPROXIMATE', '+91 9876500007'),
(8, 'Nisha Run', '1998-02-12', 'FEMALE', 'https://example.com/nisha.jpg', 'BEGINNER', 6.80, 6.0, '{"monday":"morning","thursday":"evening"}', ST_PointFromText('POINT(77.6020 12.9620)', 4326), 'APPROXIMATE', '+91 9876500008'),
(9, 'Karan Sprint', '1990-08-03', 'MALE', 'https://example.com/karan.jpg', 'ADVANCED', 4.10, 16.0, '{"wednesday":"evening","sunday":"morning"}', ST_PointFromText('POINT(77.5920 12.9840)', 4326), 'EXACT', '+91 9876500009'),
(10, 'Meera Trail', '1997-12-21', 'FEMALE', 'https://example.com/meera.jpg', 'INTERMEDIATE', 5.90, 9.0, '{"friday":"morning","saturday":"morning"}', ST_PointFromText('POINT(77.6150 12.9710)', 4326), 'APPROXIMATE', '+91 9876500010'),
(11, 'Vivek Jog', '1993-06-16', 'MALE', 'https://example.com/vivek.jpg', 'BEGINNER', 6.40, 7.0, '{"tuesday":"morning","sunday":"evening"}', ST_PointFromText('POINT(77.5860 12.9580)', 4326), 'APPROXIMATE', '+91 9876500011'),
(12, 'Anita Longrun', '1989-10-27', 'FEMALE', 'https://example.com/anita.jpg', 'ADVANCED', 4.70, 18.0, '{"thursday":"evening","saturday":"morning"}', ST_PointFromText('POINT(77.6080 12.9860)', 4326), 'EXACT', '+91 9876500012');

INSERT INTO partner_requests (user_id, date_time, distance, pace, meeting_location, notes, status, created_at) VALUES
(1, '2026-04-07 06:30:00', 8.0, 5.4, ST_PointFromText('POINT(77.5946 12.9716)', 4326), 'Easy run near Cubbon Park', 'OPEN', NOW()),
(2, '2026-04-07 18:15:00', 10.0, 4.8, ST_PointFromText('POINT(77.5950 12.9720)', 4326), 'Tempo run after work', 'OPEN', NOW()),
(3, '2026-04-08 05:45:00', 14.0, 4.3, ST_PointFromText('POINT(77.6000 12.9800)', 4326), 'Long run and coffee after', 'OPEN', NOW()),
(4, '2026-04-09 07:00:00', 5.0, 6.9, ST_PointFromText('POINT(77.5800 12.9600)', 4326), 'Beginner friendly park jog', 'OPEN', NOW()),
(5, '2026-04-08 19:00:00', 7.0, 5.6, ST_PointFromText('POINT(77.6100 12.9750)', 4326), 'Recovery run', 'OPEN', NOW()),
(6, '2026-04-10 06:00:00', 12.0, 4.7, ST_PointFromText('POINT(77.6050 12.9680)', 4326), 'Threshold intervals', 'OPEN', NOW()),
(7, '2026-04-11 06:30:00', 9.0, 5.2, ST_PointFromText('POINT(77.5880 12.9690)', 4326), 'Steady pace route', 'OPEN', NOW()),
(8, '2026-04-11 18:30:00', 6.0, 6.6, ST_PointFromText('POINT(77.6020 12.9620)', 4326), 'Sunset easy run', 'OPEN', NOW()),
(9, '2026-04-12 05:30:00', 15.0, 4.2, ST_PointFromText('POINT(77.5920 12.9840)', 4326), 'Fast long run', 'OPEN', NOW()),
(10, '2026-04-12 07:15:00', 8.0, 5.8, ST_PointFromText('POINT(77.6150 12.9710)', 4326), 'Lake side loop', 'OPEN', NOW()),
(11, '2026-04-06 06:30:00', 4.0, 6.5, ST_PointFromText('POINT(77.5860 12.9580)', 4326), 'Short weekday jog', 'CLOSED', NOW()),
(12, '2026-04-05 06:00:00', 18.0, 4.8, ST_PointFromText('POINT(77.6080 12.9860)', 4326), 'Weekend long run complete', 'CLOSED', NOW()),
(1, '2026-04-03 06:30:00', 10.0, 5.6, ST_PointFromText('POINT(77.5930 12.9705)', 4326), 'Past run data point', 'CLOSED', NOW()),
(6, '2026-04-04 18:10:00', 11.0, 4.9, ST_PointFromText('POINT(77.6060 12.9672)', 4326), 'Past tempo session', 'CLOSED', NOW()),
(3, '2026-04-13 05:40:00', 13.0, 4.4, ST_PointFromText('POINT(77.6012 12.9810)', 4326), 'Hill repeats and easy cooldown', 'OPEN', NOW()),
(2, '2026-04-13 18:20:00', 7.5, 5.0, ST_PointFromText('POINT(77.5960 12.9731)', 4326), 'Evening progression run', 'OPEN', NOW());

INSERT INTO request_responses (request_id, responder_id, status, created_at) VALUES
(1, 2, 'ACCEPTED', NOW() - INTERVAL 70 MINUTE),
(1, 5, 'PENDING', NOW() - INTERVAL 40 MINUTE),
(2, 1, 'PENDING', NOW() - INTERVAL 55 MINUTE),
(2, 9, 'REJECTED', NOW() - INTERVAL 25 MINUTE),
(3, 6, 'ACCEPTED', NOW() - INTERVAL 90 MINUTE),
(3, 12, 'PENDING', NOW() - INTERVAL 20 MINUTE),
(4, 8, 'ACCEPTED', NOW() - INTERVAL 30 MINUTE),
(5, 7, 'PENDING', NOW() - INTERVAL 15 MINUTE),
(6, 3, 'REJECTED', NOW() - INTERVAL 10 MINUTE),
(7, 10, 'ACCEPTED', NOW() - INTERVAL 5 MINUTE),
(8, 11, 'PENDING', NOW() - INTERVAL 4 MINUTE),
(9, 2, 'ACCEPTED', NOW() - INTERVAL 2 MINUTE),
(10, 6, 'PENDING', NOW() - INTERVAL 1 MINUTE),
(15, 5, 'PENDING', NOW()),
(16, 4, 'PENDING', NOW());

INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES
(1, 2, 'Hey Jane, ready for tomorrow run?', NOW() - INTERVAL 50 MINUTE),
(2, 1, 'Yes, meet at the main gate at 6:25.', NOW() - INTERVAL 48 MINUTE),
(1, 2, 'Perfect. I will be there.', NOW() - INTERVAL 47 MINUTE),
(3, 6, 'Lets keep first 3km easy and then pick pace.', NOW() - INTERVAL 40 MINUTE),
(6, 3, 'Sounds good. I will bring hydration.', NOW() - INTERVAL 38 MINUTE),
(4, 8, 'I am new to this route, can we do a shorter loop?', NOW() - INTERVAL 25 MINUTE),
(8, 4, 'Of course. We can keep it at 5km.', NOW() - INTERVAL 23 MINUTE),
(7, 10, 'See you near the metro exit.', NOW() - INTERVAL 20 MINUTE),
(10, 7, 'Confirmed. I am 5 minutes away.', NOW() - INTERVAL 18 MINUTE),
(9, 2, 'What pace are you targeting for first half?', NOW() - INTERVAL 12 MINUTE),
(2, 9, 'Around 4:55 then negative split.', NOW() - INTERVAL 10 MINUTE),
(12, 3, 'Can I join if I am slightly slower?', NOW() - INTERVAL 6 MINUTE),
(3, 12, 'Yes, we can regroup every 2km.', NOW() - INTERVAL 5 MINUTE),
(5, 1, 'Is parking available near start?', NOW() - INTERVAL 3 MINUTE),
(1, 5, 'Yes, plenty near the east entrance.', NOW() - INTERVAL 2 MINUTE);

INSERT INTO notifications (user_id, content, is_read, timestamp) VALUES
(1, 'Jane Runner accepted your running request.', FALSE, NOW() - INTERVAL 70 MINUTE),
(1, 'Alex Stride sent a response to your request.', FALSE, NOW() - INTERVAL 41 MINUTE),
(2, 'John Doe sent you a message.', TRUE, NOW() - INTERVAL 47 MINUTE),
(2, 'Karan Sprint responded to your request.', FALSE, NOW() - INTERVAL 26 MINUTE),
(3, 'Priya Pace accepted your long run request.', FALSE, NOW() - INTERVAL 90 MINUTE),
(3, 'Anita Longrun sent a response to your request.', FALSE, NOW() - INTERVAL 21 MINUTE),
(4, 'Nisha Run accepted your beginner run request.', FALSE, NOW() - INTERVAL 30 MINUTE),
(5, 'Rohan Miles responded to your recovery run.', TRUE, NOW() - INTERVAL 16 MINUTE),
(6, 'Mike Fast declined your threshold session request.', TRUE, NOW() - INTERVAL 10 MINUTE),
(7, 'Meera Trail accepted your steady run request.', FALSE, NOW() - INTERVAL 5 MINUTE),
(8, 'Vivek Jog sent a response to your sunset run.', FALSE, NOW() - INTERVAL 4 MINUTE),
(9, 'Jane Runner accepted your fast long run request.', FALSE, NOW() - INTERVAL 2 MINUTE),
(10, 'Priya Pace sent a response to your lake loop run.', FALSE, NOW() - INTERVAL 1 MINUTE),
(11, 'You have a new message from Nisha Run.', FALSE, NOW() - INTERVAL 8 MINUTE),
(12, 'Mike Fast replied to your question about pace.', FALSE, NOW() - INTERVAL 6 MINUTE);

INSERT INTO blocked_users (blocker_id, blocked_id, created_at) VALUES
(4, 9, NOW() - INTERVAL 3 DAY),
(8, 11, NOW() - INTERVAL 1 DAY),
(2, 5, NOW() - INTERVAL 6 HOUR);

-- Jayanagar-specific dataset for easier local map testing
INSERT INTO users (username, email, password, role, verified, fcm_token, created_at) VALUES
('arjun_jayanagar', 'arjun.jayanagar@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('divya_jayanagar', 'divya.jayanagar@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('naveen_jayanagar', 'naveen.jayanagar@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW()),
('shreya_jayanagar', 'shreya.jayanagar@example.com', '$2a$10$jWxNDYD9KfPoGoGNumnCXewxrHlg8WH4OQbo6g./z6fRdsu4sUDou', 'USER', TRUE, NULL, NOW());

INSERT INTO profiles (user_id, full_name, date_of_birth, gender, profile_photo_url, running_level, average_pace, preferred_distance, availability, location, privacy_level, emergency_contact) VALUES
(13, 'Arjun Rao', '1996-03-08', 'MALE', 'https://example.com/arjun.jpg', 'INTERMEDIATE', 5.40, 10.0, '{"monday":"morning","friday":"evening"}', ST_PointFromText('POINT(77.5841 12.9304)', 4326), 'APPROXIMATE', '+91 9988000013'),
(14, 'Divya Nair', '1995-12-17', 'FEMALE', 'https://example.com/divya.jpg', 'ADVANCED', 4.75, 12.0, '{"tuesday":"morning","saturday":"morning"}', ST_PointFromText('POINT(77.5802 12.9259)', 4326), 'EXACT', '+91 9988000014'),
(15, 'Naveen Kumar', '1993-07-14', 'MALE', 'https://example.com/naveen.jpg', 'BEGINNER', 6.30, 6.0, '{"wednesday":"evening","sunday":"morning"}', ST_PointFromText('POINT(77.5869 12.9238)', 4326), 'APPROXIMATE', '+91 9988000015'),
(16, 'Shreya Iyer', '1998-10-02', 'FEMALE', 'https://example.com/shreya.jpg', 'INTERMEDIATE', 5.65, 8.0, '{"thursday":"morning","saturday":"evening"}', ST_PointFromText('POINT(77.5828 12.9281)', 4326), 'APPROXIMATE', '+91 9988000016');

INSERT INTO partner_requests (user_id, date_time, distance, pace, meeting_location, notes, status, created_at) VALUES
(13, '2026-04-14 06:10:00', 7.0, 5.4, ST_PointFromText('POINT(77.5840 12.9300)', 4326), 'Jayanagar 4th Block easy run', 'OPEN', NOW()),
(14, '2026-04-14 18:20:00', 10.0, 4.8, ST_PointFromText('POINT(77.5808 12.9265)', 4326), 'Evening tempo from South End Circle', 'OPEN', NOW()),
(15, '2026-04-15 06:30:00', 5.0, 6.4, ST_PointFromText('POINT(77.5861 12.9242)', 4326), 'Beginner jog around Jayanagar park', 'OPEN', NOW()),
(16, '2026-04-15 19:00:00', 8.0, 5.7, ST_PointFromText('POINT(77.5832 12.9286)', 4326), 'Steady paced run from 9th Block', 'OPEN', NOW());