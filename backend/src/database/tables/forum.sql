CREATE TABLE forums (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

