CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Comment Database Setup
CREATE DATABASE comment_db;

USE comment_db;

CREATE TABLE Comments
( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment VARCHAR(100),
    commentorId VARCHAR(45),
    commentorType VARCHAR(20),
    receiverId VARCHAR(45),
    receiverType VARCHAR(20),
    datetime DATETIME,
    anonymous TINYINT(0) DEFAULT 0
);

INSERT INTO Comments(comment, commentorId, commentorType, receiverId, receiverType, datetime, anonymous) 
VALUES
("Great at working in teams.", "fwna55ir8hqo57xl", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
("Great team player.", "9e8uqiz7xat21opf", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), false),
("Great classmate.", "w8zuzvgadqbuift3", "Student", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "zv04w3y2tlcn5hj1", "Student", NOW(), false),

("Awesome table partner.", "zv04w3y2tlcn5hj1", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
("Has great leadership.", "9e8uqiz7xat21opf", "Student", "fwna55ir8hqo57xl", "Student", NOW(), false),
("Best CCA captain.", "w8zuzvgadqbuift3", "Student", "fwna55ir8hqo57xl", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "fwna55ir8hqo57xl", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "fwna55ir8hqo57xl", "Student", NOW(), false),

("Nice person to talk to.", "zv04w3y2tlcn5hj1", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
("Love this person's personality.", "fwna55ir8hqo57xl", "Student", "9e8uqiz7xat21opf", "Student", NOW(), false),
("Great attitude.", "w8zuzvgadqbuift3", "Student", "9e8uqiz7xat21opf", "Student", NOW(), true),
("Hands up work on time.", "g8m1ce47c43blq0n", "Tutor", "9e8uqiz7xat21opf", "Student", NOW(), true),
("Good student.", "eg05suc92vnad01m", "Tutor", "9e8uqiz7xat21opf", "Student", NOW(), false);

