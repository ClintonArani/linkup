CREATE PROCEDURE CreateForum
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @iconUrl VARCHAR(255),
    @createdBy VARCHAR(255),
    @createdAt DATETIME
AS
BEGIN
    INSERT INTO forums (id, title, description, iconUrl, createdBy, createdAt)
    VALUES (@id, @title, @description, @iconUrl, @createdBy, @createdAt);
END;
 