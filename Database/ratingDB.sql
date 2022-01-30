CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Rating Database Setup
CREATE DATABASE rating_db;

USE rating_db;

CREATE TABLE Ratings
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT(1),
    raterId VARCHAR(10),
    raterType VARCHAR(20),
    receiverId VARCHAR(10),
    receiverType VARCHAR(20),
    datetime DATETIME,
    anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Ratings(rating, raterId, raterType, receiverId, receiverType, datetime, anonymous) 
VALUES
(4, "T01234567A", "tutor", "S01234567A", "student", NOW(), false),
(5, "T12345678B", "tutor", "S01234567A", "student", NOW(), true),

(4, "T01234567A", "tutor", "S12345678B", "student", NOW(), true),
(5, "T12345678B", "tutor", "S12345678B", "student", NOW(), false),

(4, "T01234567A", "tutor", "S23456789C", "student", NOW(), false),
(5, "T12345678B", "tutor", "S23456789C", "student", NOW(), true);