CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Students Database Setup (TO REMOVE AFTER COLLABORATION)
CREATE DATABASE student_db;

USE student_db;

CREATE TABLE Students
(
    id VARCHAR(45) PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO Students() 
VALUES 
("zv04w3y2tlcn5hj1","Jack"),
("fwna55ir8hqo57xl","Jane"),
("9e8uqiz7xat21opf","John"),
("w8zuzvgadqbuift3","Jerry"),
("lq8icgrfhniq5icg","Jenny"),
("y1k2hcsq7qztrfoh","James");
-- ("kali9hexc0kkkfei","Jamie"),
-- ("c5v2qts5a008xm4j","Jeremy"),
-- ("44ukr6av0n1903f5","Jasmine");

