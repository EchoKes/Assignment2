CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Comment Database Setup
CREATE DATABASE comment_db;

USE comment_db;

CREATE TABLE Comments
( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(100),
    commentorId VARCHAR(45),
    commentorType VARCHAR(20),
    receiverId VARCHAR(45),
    receiverType VARCHAR(20),
    datetime DATETIME,
    anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Comments(message, commentorId, commentorType, receiverId, receiverType, datetime, anonymous)
VALUES("This student possess great leadership.", "5fbfxpmjgnkz5d07", "Teacher", "szfjg7oovjedz91k", "Student", NOW(), false);

-- Rating Database Setup
CREATE DATABASE rating_db;

USE rating_db;

CREATE TABLE Ratings
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT(1),
    raterId VARCHAR(45),
    raterType VARCHAR(20),
    receiverId VARCHAR(45),
    receiverType VARCHAR(20),
    datetime DATETIME,
    anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Ratings(rating, raterId, raterType, receiverId, receiverType, datetime, anonymous)
VALUES(4, "u1e7fh3h35085v9l", "Student", "4lnc28ivfqvfyrn5", "Teacher", NOW(), false);
