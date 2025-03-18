CREATE PROCEDURE updateResource
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @filePath VARCHAR(255),
    @imagePath VARCHAR(255),
    @quantity INT,
    @updatedAt DATETIME
AS
BEGIN
    UPDATE resources
    SET 
        title = @title,
        description = @description,
        filePath = @filePath,
        imagePath = @imagePath,
        quantity = @quantity,
        updatedAt = @updatedAt
    WHERE id = @id;
END;