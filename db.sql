DROP DATABASE IF EXISTS blog;
CREATE DATABASE blog;

-- user table
DROP TABLE IF EXISTS blog.user;
CREATE TABLE blog.user (
  id       INT          AUTO_INCREMENT PRIMARY KEY
  COMMENT 'id PK',
  username VARCHAR(255) NOT NULL UNIQUE
  COMMENT 'username',
  password VARCHAR(255) NOT NULL
  COMMENT 'password',
  avatar   VARCHAR(255) DEFAULT 'default.svg'
  COMMENT 'avatar'
)
  COMMENT 'user table';

-- user post
DROP TABLE IF EXISTS blog.post;
CREATE TABLE blog.post (
  id      INT      AUTO_INCREMENT PRIMARY KEY
  COMMENT 'id PK',
  title   VARCHAR(255) NOT NULL
  COMMENT 'title',
  content MEDIUMTEXT   NOT NULL
  COMMENT 'content',
  time    DATETIME DEFAULT now()
  COMMENT 'post time',
  userId  INT COMMENT 'user id FK'
)
  COMMENT 'post table';

-- add FK constraint
ALTER TABLE blog.post
  ADD CONSTRAINT
  post_fk_userId
FOREIGN KEY (userId)
REFERENCES blog.user (id);

-- select
SELECT *
FROM blog.user;

SELECT *
FROM blog.post;

SELECT
  p.*,
  u.id AS userId,
  u.username,
  u.avatar
FROM
  blog.post p
  RIGHT OUTER JOIN
  blog.user u
    ON
      p.userId = u.id
WHERE
  u.username = 'tom'
ORDER BY id DESC;

TRUNCATE blog.post;
