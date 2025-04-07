CREATE OR ALTER PROCEDURE getResourceById
    @id VARCHAR(255)
AS
BEGIN
    SELECT 
        id, 
        title, 
        description, 
        createdAt, 
        quantity,
        updatedAt 
    FROM resources 
    WHERE id = @id AND isDeleted = 0;
END;

