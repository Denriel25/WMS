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
INSERT INTO users
(id, employee_id, full_name, email, role, status)
VALUES

(gen_random_uuid(),'EMP-001','Juan Dela Cruz','admin@librarylink.edu','admin','active'),
(gen_random_uuid(),'EMP-002','Maria Santos','maria@librarylink.edu','librarian','active'),
(gen_random_uuid(),'EMP-003','James Reyes','james@librarylink.edu','assistant','active');