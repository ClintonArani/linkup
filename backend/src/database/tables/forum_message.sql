CREATE TABLE forum_messages (
    id VARCHAR(255) PRIMARY KEY,
    forumId VARCHAR(255) NOT NULL,
    senderId VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    fileUrl VARCHAR(255),
    fileName VARCHAR(255),
    sentAt DATETIME NOT NULL,
    FOREIGN KEY (forumId) REFERENCES forums(id),
    FOREIGN KEY (senderId) REFERENCES users(id)
);

drop table forum_messages