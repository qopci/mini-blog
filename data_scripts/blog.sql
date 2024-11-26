CREATE DATABASE blog;

USE blog;

DROP TABLE IF EXISTS blog; 

CREATE TABLE posts(
	id INT AUTO_INCREMENT,
	author VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
	created_at DATETIME DEFAULT NOW(),
    
    PRIMARY KEY(id)
);

INSERT INTO posts(author, title, content) VALUES ('Jett', 'Valorant', 'jett@gmail.com');

SELECT * FROM posts;