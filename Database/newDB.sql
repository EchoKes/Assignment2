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
VALUES
("Great at working in teams.", "fwna55ir8hqo57xl", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
("Great team player.", "9e8uqiz7xat21opf", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
("Great classmate.", "w8zuzvgadqbuift3", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), false),

("Awesome table partner.", "zv04w3y2tlcn5hj1", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
("Has great leadership.", "9e8uqiz7xat21opf", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
("Best CCA captain.", "w8zuzvgadqbuift3", "Student", "fwna55ir8hqo57xl", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), false),

("Nice person to talk to.", "zv04w3y2tlcn5hj1", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
("Love this person's personality.", "fwna55ir8hqo57xl", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
("Great attitude.", "w8zuzvgadqbuift3", "Student", "9e8uqiz7xat21opf", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), false);


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

-- Students Database Setup (TO REMOVE AFTER COLLABORATION)
CREATE DATABASE student_db;

USE student_db;

CREATE TABLE Students
(
    id VARCHAR(45),
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

-- Tutors Database Setup (TO REMOVE AFTER COLLABORATION)
CREATE DATABASE tutor_db;

USE tutor_db;

CREATE TABLE Tutors
(
    id VARCHAR(45),
    name VARCHAR(255)
);

INSERT INTO Tutors() 
VALUES 
("g8m1ce47c43blq0n","Wenwei"),
("eg05suc92vnad01m","Naomi");