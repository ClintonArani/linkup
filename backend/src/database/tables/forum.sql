CREATE TABLE forums (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    iconUrl VARCHAR(255),
    createdBy VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (createdBy) REFERENCES users(id)
);


drop TABLE forums