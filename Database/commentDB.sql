CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Comment Database Setup
CREATE DATABASE comment_db;

USE comment_db;

CREATE TABLE Comments
( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment VARCHAR(100),
    commentorId VARCHAR(10),
    commentorType VARCHAR(20),
    receiverId VARCHAR(10),
    receiverType VARCHAR(20),
    datetime DATETIME,
    anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Comments(comment, commentorId, commentorType, receiverId, receiverType, datetime, anonymous) 
VALUES
("Hands up work on time.", "T01234567A", "tutor", "S01234567A", "student", NOW(), true),
("Good student.", "T12345678B", "tutor", "S01234567A", "student", NOW(), false),

("Hands up work on time.", "T01234567A", "tutor", "S12345678B", "student", NOW(), true),
("Good student.", "T12345678B", "tutor", "S12345678B", "student", NOW(), false),

("Hands up work on time.", "T01234567A", "tutor", "S23456789C", "student", NOW(), true),
("Good student.", "T12345678B", "tutor", "S23456789C", "student", NOW(), false);
