
CREATE PROCEDURE addResource
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @filePath VARCHAR(255),
    @imagePath VARCHAR(255),
    @quantity INT,
    @createdAt DATETIME
AS
BEGIN
    INSERT INTO resources (id, title, description, filePath, imagePath, quantity, createdAt)
    VALUES (@id, @title, @description, @filePath, @imagePath, @quantity, @createdAt);
END;