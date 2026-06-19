CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT REFERENCES books(id),
    student_id BIGINT REFERENCES students(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO reviews
(book_id,student_id,rating,review_text)

SELECT
1,
id,
5,
'Best algorithms book for Computer Science students.'
FROM students
WHERE student_no='2024-0001';

INSERT INTO reviews
(book_id,student_id,rating,review_text)

SELECT
5,
id,
5,
'Gilbert Strang explains concepts clearly.'
FROM students
WHERE student_no='2024-0002';

INSERT INTO reviews
(book_id,student_id,rating,review_text)

SELECT
8,
id,
4,
'Excellent introduction to AI.'
FROM students
WHERE student_no='2024-0003';