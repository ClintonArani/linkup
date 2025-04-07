CREATE PROCEDURE updateResource
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @quantity INT,
    @updatedAt DATETIME
AS
BEGIN
    UPDATE resources
    SET 
        title = @title,
        description = @description,
        quantity = @quantity,
        updatedAt = @updatedAt
    WHERE id = @id;
END;
