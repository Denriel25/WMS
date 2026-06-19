CREATE TABLE borrowing (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    book_id BIGINT REFERENCES books(id),
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO borrowing
(student_id,book_id,borrow_date,due_date,status)

SELECT
s.id,
1,
CURRENT_DATE - 5,
CURRENT_DATE + 10,
'borrowed'
FROM students s
WHERE s.student_no='2024-0002';

INSERT INTO borrowing
(student_id,book_id,borrow_date,due_date,status)

SELECT
s.id,
4,
CURRENT_DATE - 20,
CURRENT_DATE - 5,
'overdue'
FROM students s
WHERE s.student_no='2024-0005';