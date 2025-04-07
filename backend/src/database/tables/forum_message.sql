CREATE TABLE forum_messages (
    id VARCHAR(255) PRIMARY KEY,
    forum_id VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    message TEXT,
    file_url VARCHAR(255),
    file_name VARCHAR(255),
    sent_at DATETIME NOT NULL,
    FOREIGN KEY (forum_id) REFERENCES forums(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

