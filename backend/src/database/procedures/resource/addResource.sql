CREATE PROCEDURE addResource
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @quantity INT,
    @createdAt DATETIME
AS
BEGIN
    INSERT INTO resources (id, title, description, quantity, createdAt)
    VALUES (@id, @title, @description, @quantity, @createdAt);
END;
