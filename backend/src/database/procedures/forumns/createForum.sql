CREATE PROCEDURE CreateForum
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @icon_url VARCHAR(255), -- icon_url is required
    @created_by VARCHAR(255)
AS
BEGIN
    INSERT INTO forums (id, title, description, icon_url, created_by, created_at)
    VALUES (@id, @title, @description, @icon_url, @created_by, GETDATE());
END


drop procedure createForm