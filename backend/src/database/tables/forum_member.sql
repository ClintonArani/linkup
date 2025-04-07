CREATE TABLE forum_members (
    id VARCHAR(255) PRIMARY KEY,
    forum_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    joined_at DATETIME NOT NULL,
    FOREIGN KEY (forum_id) REFERENCES forums(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);