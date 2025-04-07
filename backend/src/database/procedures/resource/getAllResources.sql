CREATE PROCEDURE getAllResources
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
    WHERE isDeleted = 0;
END;

drop procedure getAllResources
