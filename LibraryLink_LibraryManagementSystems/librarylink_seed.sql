-- LibraryLink - improved database sample seed (PostgreSQL)
-- Run: psql -f librarylink_seed.sql
-- Notes:
-- 1) Uses pgcrypto for gen_random_uuid()
-- 2) Keeps UUID ids for students/users; uses BIGINT for books/borrowing/reservation rows.
-- 3) Adds coherent sample data and fixes FK inconsistencies in existing files.

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop in reverse dependency order (safe for sample resets)
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS fines CASCADE;
DROP TABLE IF EXISTS issued_books CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS borrowing CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_no VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    course VARCHAR(100),
    year_level INTEGER,
    section VARCHAR(50),
    phone VARCHAR(30),
    address TEXT,
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (employees/librarians/admin)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    role VARCHAR(20) DEFAULT 'librarian',
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Books
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    isbn VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year INTEGER,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    cover_image TEXT,
    language VARCHAR(50),
    total_copies INTEGER DEFAULT 1 CHECK (total_copies >= 0),
    available_copies INTEGER DEFAULT 1 CHECK (available_copies >= 0),
    shelf_location VARCHAR(100),
    rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Borrowing (issue history)
CREATE TABLE borrowing (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed' CHECK (status IN ('borrowed','returned','overdue')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Issued books records (receipt-like)
CREATE TABLE issued_books (
    id BIGSERIAL PRIMARY KEY,
    borrowing_id BIGINT UNIQUE REFERENCES borrowing(id) ON DELETE CASCADE,
    issue_number VARCHAR(50) UNIQUE,
    issued_by UUID REFERENCES users(id) ON DELETE SET NULL,
    issue_date TIMESTAMP DEFAULT NOW(),
    remarks TEXT
);

-- Reservations
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    reservation_date TIMESTAMP DEFAULT NOW(),
    expiration_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','cancelled','fulfilled'))
);

-- Fines
CREATE TABLE fines (
    id BIGSERIAL PRIMARY KEY,
    borrowing_id BIGINT UNIQUE REFERENCES borrowing(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    reason TEXT,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fines_student_match_borrowing UNIQUE (borrowing_id, student_id)
);

-- Reviews
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications (for students)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activity log (for users)
CREATE TABLE activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Helpful indices
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_borrowing_student ON borrowing(student_id);
CREATE INDEX idx_borrowing_book ON borrowing(book_id);
CREATE INDEX idx_fines_student ON fines(student_id);
CREATE INDEX idx_notifications_student ON notifications(student_id);
CREATE INDEX idx_reviews_book ON reviews(book_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);


-- Seed: Categories
INSERT INTO categories (id, name, description) VALUES
(1,'Computer Science','Programming, AI, Networks and Systems'),
(2,'Mathematics','Pure and Applied Mathematics'),
(3,'Physics','Physics and Astronomy'),
(4,'History','Historical Studies'),
(5,'Literature','Classic and Modern Literature'),
(6,'Engineering','Engineering Resources'),
(7,'Business','Business and Entrepreneurship'),
(8,'Education','Teaching and Learning')
ON CONFLICT (id) DO NOTHING;

-- Seed: Users
-- Using fixed UUIDs makes it easier for app integration.
-- If you prefer random UUIDs, remove the explicit ids.
INSERT INTO users (id, employee_id, full_name, email, password_hash, role, status) VALUES
('11111111-1111-1111-1111-111111111111','EMP-001','Juan Dela Cruz','admin@librarylink.edu','admin123','admin','active'),
('22222222-2222-2222-2222-222222222222','EMP-002','Sara Qureshi','sara.q@librarylink.edu','lib123','librarian','active'),
('33333333-3333-3333-3333-333333333333','EMP-003','James Reyes','james@librarylink.edu','assistant123','assistant','active')
ON CONFLICT (email) DO NOTHING;

-- Seed: Students
INSERT INTO students (id, student_no, full_name, email, course, year_level, section, phone, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001','2024-0001','Angela Cruz','angela@students.edu','BSIT',3,'3A','0917-000-0001','active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002','2024-0002','Mark Reyes','mark@students.edu','BSCS',2,'2B','0917-000-0002','active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003','2024-0003','Jasmine Torres','jasmine@students.edu','BSIT',4,'4A','0917-000-0003','active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004','2024-0004','Kevin Santos','kevin@students.edu','BSBA',1,'1C','0917-000-0004','active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005','2024-0005','Nicole Mendoza','nicole@students.edu','BSED',2,'2A','0917-000-0005','active')
ON CONFLICT (student_no) DO NOTHING;


-- Seed: Books (IDs are BIGSERIAL; we rely on ISBN uniqueness + lookups)
-- We insert with explicit ids to keep relationships deterministic.
INSERT INTO books (
    id,isbn,title,author,publisher,publication_year,category_id,
    description,cover_image,total_copies,available_copies,shelf_location,
    rating,total_reviews
) VALUES
(1,'9780262033848','Introduction to Algorithms','Thomas H. Cormen','MIT Press',2022,1,
 'Comprehensive guide to algorithms.','https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1',5,3,'CS-A1',4.8,24),
(2,'9780134686068','Database Systems','Ramez Elmasri','Pearson',2021,1,
 'Database concepts and applications.','https://images.unsplash.com/photo-1599837487527-e009248aa71b',4,3,'CS-A2',4.5,18),
(3,'9780133591620','Operating Systems','Andrew Tanenbaum','Pearson',2023,1,
 'Operating systems design and implementation.','https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c',4,2,'CS-A3',4.6,31),
(4,'9781285741550','Calculus Early Transcendentals','James Stewart','Cengage',2020,2,
 'University calculus textbook.','https://images.unsplash.com/photo-1509228468518-180dd4864904',6,4,'MATH-B1',4.4,42),
(5,'9780980237600','Linear Algebra','Gilbert Strang','MIT',2023,2,
 'Linear algebra with practical applications.','https://images.unsplash.com/photo-1632571401005-458e9d244591',5,3,'MATH-B2',4.9,38),
(6,'9780141439518','Pride and Prejudice','Jane Austen','Penguin',2002,5,
 'Classic literature novel.','https://images.unsplash.com/photo-1521587760476-6c12a4b040da',7,6,'LIT-C1',4.7,56),
(7,'9780062316097','Sapiens','Yuval Noah Harari','Harper',2015,4,
 'History of humankind.','https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',4,3,'HIS-D1',4.6,67),
(8,'9780136042594','Artificial Intelligence','Stuart Russell','Pearson',2020,1,
 'Leading AI textbook.','https://images.unsplash.com/photo-1505664194779-8beaceb93744',3,3,'CS-A4',4.8,19),
(9,'9781492078005','Effective Java','Joshua Bloch','Addison-Wesley',2018,6,
 'Best practices for Java.','https://images.unsplash.com/photo-1516979187457-637abb4f9353',3,2,'ENG-E1',4.9,77),
(10,'9780132350884','Clean Code','Robert C. Martin','Prentice Hall',2008,1,
 'A Handbook of Agile Software Craftsmanship.','https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',5,4,'CS-A5',4.7,102),
(11,'9780262013842','Introduction to the Theory of Computation','Michael Sipser','Cengage',2012,1,
 'Automata, computability, and complexity.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',4,3,'CS-A6',4.6,33),
(12,'9780131103627','The C Programming Language','Brian W. Kernighan','Prentice Hall',1988,1,
 'Classic C programming reference.','https://images.unsplash.com/photo-1523240795612-9a054b0db644',2,1,'CS-A7',4.5,21)
ON CONFLICT (isbn) DO NOTHING;


-- Seed: Borrowing records
-- Borrowing: one returned/overdue to generate fines.
-- Use deterministic IDs.
INSERT INTO borrowing (id, student_id, book_id, borrow_date, due_date, return_date, status) VALUES
(1,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002',1, (CURRENT_DATE - 5)::date, (CURRENT_DATE + 10)::date, NULL,'borrowed'),
(2,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005',3, (CURRENT_DATE - 20)::date, (CURRENT_DATE - 5)::date, NULL,'overdue'),
(3,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',2, (CURRENT_DATE - 30)::date, (CURRENT_DATE - 10)::date, (CURRENT_DATE - 12)::date,'returned')
ON CONFLICT (id) DO NOTHING;

-- Seed: Issued books
INSERT INTO issued_books (id, borrowing_id, issue_number, issued_by, issue_date, remarks) VALUES
(1,1,'ISS-2026-0001','22222222-2222-2222-2222-222222222222', NOW(),'Issued Introduction to Algorithms'),
(2,2,'ISS-2026-0002','22222222-2222-2222-2222-222222222222', NOW(),'Issued Operating Systems'),
(3,3,'ISS-2026-0003','33333333-3333-3333-3333-333333333333', NOW(),'Issued Database Systems')
ON CONFLICT (issue_number) DO NOTHING;

-- Seed: Reservations
INSERT INTO reservations (id, student_id, book_id, reservation_date, expiration_date, status) VALUES
(1,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',2, NOW(), (NOW() + INTERVAL '7 days'), 'active'),
(2,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004',8, NOW(), (NOW() + INTERVAL '5 days'), 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed: Reviews
INSERT INTO reviews (id, book_id, student_id, rating, review_text, created_at) VALUES
(1,1,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',5,'Best algorithms book for Computer Science students.', NOW()),
(2,2,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002',5,'Database concepts explained clearly and practically.', NOW()),
(3,8,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003',4,'Excellent introduction to AI.', NOW()),
(4,6,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004',5,'A timeless classic with engaging storytelling.', NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed: Fines (based on overdue borrowing_id=2)
INSERT INTO fines (id, borrowing_id, student_id, amount, reason, paid, paid_at, created_at) VALUES
(1,2,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005',150.00,'Late return penalty','false'::boolean,NULL,NOW())
ON CONFLICT (borrowing_id) DO NOTHING;

-- Seed: Notifications
INSERT INTO notifications (id, student_id, title, message, notification_type, is_read, created_at) VALUES
(1,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002','Book Due Reminder','Your borrowed book is due in 3 days.','due_reminder',false,NOW()),
(2,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001','Reservation Approved','Your reserved book is ready for pickup.','reservation',false,NOW()),
(3,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005','Overdue Notice','You have an overdue book. Please return it to avoid more fines.','overdue',false,NOW()),
(4,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003','New Review Opportunity','Rate the books you read this semester.','reviews',true,NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed: Activity log
INSERT INTO activity_log (id, user_id, action, module, description, ip_address, created_at) VALUES
(1,'11111111-1111-1111-1111-111111111111','Added Book','Books','Added Artificial Intelligence textbook',NULL,NOW()),
(2,'22222222-2222-2222-2222-222222222222','Issued Book','Borrowing','Issued Introduction to Algorithms',NULL,NOW()),
(3,'33333333-3333-3333-3333-333333333333','Added Student','Students','Registered Angela Cruz',NULL,NOW())
ON CONFLICT (id) DO NOTHING;

-- Adjust available copies to match sample borrowing/reservations (optional)
-- This is best-effort: update books.available_copies based on borrowing where not returned.
UPDATE books b
SET available_copies = GREATEST(
    0,
    b.total_copies - (
        SELECT COUNT(*)
        FROM borrowing br
        WHERE br.book_id = b.id
          AND br.status IN ('borrowed','overdue')
    )
)
WHERE b.total_copies IS NOT NULL;

COMMIT;

-- End of seed script

