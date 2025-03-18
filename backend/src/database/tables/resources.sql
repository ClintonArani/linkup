-- Table for resources (books, PDFs, etc.)
CREATE TABLE resources (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    filePath VARCHAR(255) NOT NULL, -- Path to the uploaded file (PDF, DOC, etc.)
    imagePath VARCHAR(255), -- Path to the uploaded image
    isDeleted BIT DEFAULT 0,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME
);

-- Table to track borrowed books
CREATE TABLE borrowed_books (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    borrowed_date DATE NOT NULL,
    return_date DATE NOT NULL,
    is_returned BIT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

use university