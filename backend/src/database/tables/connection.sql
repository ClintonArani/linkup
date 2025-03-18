CREATE TABLE connections (
    id VARCHAR(255) PRIMARY KEY,
    senderId VARCHAR(255) NOT NULL, -- User who sent the request
    receiverId VARCHAR(255) NOT NULL, -- User who received the request
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (receiverId) REFERENCES users(id)
);
