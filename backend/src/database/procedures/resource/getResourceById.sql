CREATE OR ALTER PROCEDURE getResourceById
    @id VARCHAR(255)
AS
BEGIN
    SELECT 
        id, 
        title, 
        description, 
        filePath, 
        imagePath, 
        createdAt, 
        quantity,
        updatedAt 
    FROM resources 
    WHERE id = @id AND isDeleted = 0;
END;