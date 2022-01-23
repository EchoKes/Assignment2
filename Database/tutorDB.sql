CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Tutors Database Setup (TO REMOVE AFTER COLLABORATION)
CREATE DATABASE tutor_db;

USE tutor_db;

CREATE TABLE Tutors
(
    id VARCHAR(45) PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO Tutors() 
VALUES 
("g8m1ce47c43blq0n","Wenwei"),
("eg05suc92vnad01m","Naomi");