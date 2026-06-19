CREATE TABLE issued_books (
    id BIGSERIAL PRIMARY KEY,
    borrowing_id BIGINT REFERENCES borrowing(id),
    issue_number VARCHAR(50) UNIQUE,
    issued_by UUID REFERENCES users(id),
    issue_date TIMESTAMP DEFAULT NOW(),
    remarks TEXT
);
INSERT INTO issued_books
(borrowing_id,issue_number,issue_date)

VALUES

(1,'ISS-2025-0001',NOW()),
(2,'ISS-2025-0002',NOW());