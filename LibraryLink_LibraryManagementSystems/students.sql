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
INSERT INTO students
(id, student_no, full_name, email, course, year_level, section, status)
VALUES

(gen_random_uuid(),'2024-0001','Angela Cruz','angela@students.edu','BSIT',3,'3A','active'),
(gen_random_uuid(),'2024-0002','Mark Reyes','mark@students.edu','BSCS',2,'2B','active'),
(gen_random_uuid(),'2024-0003','Jasmine Torres','jasmine@students.edu','BSIT',4,'4A','active'),
(gen_random_uuid(),'2024-0004','Kevin Santos','kevin@students.edu','BSBA',1,'1C','active'),
(gen_random_uuid(),'2024-0005','Nicole Mendoza','nicole@students.edu','BSED',2,'2A','active');