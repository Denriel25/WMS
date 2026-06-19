CREATE TABLE activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO activity_log
(user_id,action,module,description)

SELECT
id,
'Added Book',
'Books',
'Added Artificial Intelligence textbook'
FROM users
WHERE employee_id='EMP-001';

INSERT INTO activity_log
(user_id,action,module,description)

SELECT
id,
'Issued Book',
'Borrowing',
'Issued Introduction to Algorithms'
FROM users
WHERE employee_id='EMP-002';

INSERT INTO activity_log
(user_id,action,module,description)

SELECT
id,
'Added Student',
'Students',
'Registered Angela Cruz'
FROM users
WHERE employee_id='EMP-003';