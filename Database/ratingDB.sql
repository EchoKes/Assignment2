CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

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
VALUES
(4, "fwna55ir8hqo57xl", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
(5, "9e8uqiz7xat21opf", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
(4, "w8zuzvgadqbuift3", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
(4, "g8m1ce47c43blq0n", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), false),

(3, "9e8uqiz7xat21opf", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
(5, "w8zuzvgadqbuift3", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
(3, "zv04w3y2tlcn5hj1", "Student", "fwna55ir8hqo57xl", "Student", NOW(), true),
(4, "g8m1ce47c43blq0n", "Tutor", "fwna55ir8hqo57xl", "Student", NOW(), false),

(5, "zv04w3y2tlcn5hj1", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
(5, "w8zuzvgadqbuift3", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
(4, "fwna55ir8hqo57xl", "Student", "9e8uqiz7xat21opf", "Student", NOW(), true),
(4, "g8m1ce47c43blq0n", "Tutor", "9e8uqiz7xat21opf", "Student", NOW(), false);
