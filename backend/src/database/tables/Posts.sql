-- Create Posts table
CREATE TABLE Posts (
    id VARCHAR(255) PRIMARY KEY,  
    user_id VARCHAR(255) NOT NULL, 
    content TEXT,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(id)
)

-- Create PostLikes table
CREATE TABLE PostLikes (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT UC_PostLike UNIQUE (post_id, user_id)
);

-- Create PostComments table
CREATE TABLE PostComments (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

