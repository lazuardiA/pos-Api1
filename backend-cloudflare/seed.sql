-- Jalankan dengan: npm run db:seed:local (lokal) atau npm run db:seed:remote (production)
-- Password: admin -> admin123 | member1 -> member123

DELETE FROM users WHERE username IN ('admin', 'member1');
DELETE FROM gym_classes;

INSERT INTO users (id, name, username, email, password_hash, phone, role, membership_type, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Gym', 'admin', 'admin@gymbooking.com',
 'pbkdf2$100000$4PSz2r8k/2V3zfIxSvWTtA==$yNRpGMLvPBwIxFwwlQL5jXLm0z5RsNZwJPuHMktGfLE=', '', 'admin', 'platinum', 1),
('22222222-2222-2222-2222-222222222222', 'Budi Santoso', 'member1', 'member1@gymbooking.com',
 'pbkdf2$100000$qmW7en2IkuZq/ip4DmkOwQ==$pdeQRUJch9FzR0z9pW14V9pOduIqhsI0PmE8m314Cxc=', '', 'member', 'silver', 1);

INSERT INTO gym_classes (id, name, category, trainer, description, day, start_time, end_time, capacity, room, is_active) VALUES
('33333333-3333-3333-3333-333333333331', 'Morning Yoga Flow', 'Yoga', 'Sarah Wijaya', 'Kelas yoga ringan untuk memulai hari dengan tenang', 'Senin', '06:00', '07:00', 15, 'Studio 1', 1),
('33333333-3333-3333-3333-333333333332', 'HIIT Blast', 'HIIT', 'Rangga Pratama', 'Latihan interval intensitas tinggi untuk membakar kalori maksimal', 'Selasa', '17:00', '18:00', 20, 'Studio 2', 1),
('33333333-3333-3333-3333-333333333333', 'Strength Fundamentals', 'Strength', 'Dimas Aditya', 'Latihan beban dasar untuk membangun kekuatan otot', 'Rabu', '18:00', '19:00', 12, 'Gym Floor', 1),
('33333333-3333-3333-3333-333333333334', 'Zumba Party', 'Zumba', 'Nina Kartika', 'Kelas dansa energik yang menyenangkan untuk semua level', 'Kamis', '19:00', '20:00', 25, 'Studio 1', 1),
('33333333-3333-3333-3333-333333333335', 'Boxing Basics', 'Boxing', 'Andra Firmansyah', 'Teknik dasar tinju sekaligus melatih ketahanan tubuh', 'Jumat', '16:00', '17:00', 10, 'Boxing Ring', 1);
