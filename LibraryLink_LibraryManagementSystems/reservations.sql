CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    book_id BIGINT REFERENCES books(id),
    reservation_date TIMESTAMP DEFAULT NOW(),
    expiration_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);
INSERT INTO reservations
(student_id,book_id,status)

SELECT
s.id,
2,
'active'
FROM students s
WHERE s.student_no='2024-0001';

INSERT INTO reservations
(student_id,book_id,status)

SELECT
s.id,
7,
'active'
FROM students s
WHERE s.student_no='2024-0004';