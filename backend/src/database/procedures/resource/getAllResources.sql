CREATE OR ALTER PROCEDURE getAllResources
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
    WHERE isDeleted = 0;
END;

