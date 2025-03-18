CREATE TABLE forum_members (
    id VARCHAR(255) PRIMARY KEY,
    forumId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    joinedAt DATETIME NOT NULL,
    FOREIGN KEY (forumId) REFERENCES forums(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

drop table forum_members