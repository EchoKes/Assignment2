CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Comment Database Setup
CREATE DATABASE comment_db;

USE comment_db;

CREATE TABLE Comments
(
    CommentID VARCHAR(16) PRIMARY KEY,
    TutorID VARCHAR(16),
    StudentID VARCHAR(16),
    CommentDesc VARCHAR(255),
    DatetimePublished DATETIME,
    Anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Comments()
VALUES("4lnc28ivfqvfyrn5", "linhcz2qa1e3g9t3", "szfjg7oovjedz91k", "awesome comment", NOW(), false);

-- Rating Database Setup
CREATE DATABASE rating_db;

USE rating_db;

CREATE TABLE Ratings
(
    RatingID VARCHAR(16) PRIMARY KEY,
    TutorID VARCHAR(16),
    StudentID VARCHAR(16),
    RatingScore INT,
    DatetimePublished DATETIME,
    Anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Ratings()
VALUES("6e5j8i6z5ve7v1up", "jidn8t3qh2bi91fp", "u1e7fh3h35085v9l", 4, NOW(), false);
