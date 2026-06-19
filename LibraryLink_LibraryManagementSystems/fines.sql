CREATE TABLE fines (
    id BIGSERIAL PRIMARY KEY,
    borrowing_id BIGINT REFERENCES borrowing(id),
    student_id UUID REFERENCES students(id),
    amount NUMERIC(10,2) NOT NULL,
    reason TEXT,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO fines
(borrowing_id,student_id,amount,reason)

SELECT
2,
id,
150.00,
'Late return penalty'
FROM students
WHERE student_no='2024-0005';