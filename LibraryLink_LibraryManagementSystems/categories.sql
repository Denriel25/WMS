CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);
INSERT INTO categories (id, name, description) VALUES
(1,'Computer Science','Programming, AI, Networks and Systems'),
(2,'Mathematics','Pure and Applied Mathematics'),
(3,'Physics','Physics and Astronomy'),
(4,'History','Historical Studies'),
(5,'Literature','Classic and Modern Literature'),
(6,'Engineering','Engineering Resources'),
(7,'Business','Business and Entrepreneurship'),
(8,'Education','Teaching and Learning');