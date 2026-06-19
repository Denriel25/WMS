CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO notifications
(student_id,title,message,notification_type)

SELECT
id,
'Book Due Reminder',
'Your borrowed book is due in 3 days.',
'due_reminder'
FROM students
WHERE student_no='2024-0002';

INSERT INTO notifications
(student_id,title,message,notification_type)

SELECT
id,
'Reservation Approved',
'Your reserved book is ready for pickup.',
'reservation'
FROM students
WHERE student_no='2024-0001';