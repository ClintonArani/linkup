CREATE PROCEDURE editForum
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @icon_url VARCHAR(255) = NULL -- Make icon_url optional
AS
BEGIN
    UPDATE forums
    SET title = @title,
        description = @description,
        icon_url = @icon_url,
        updated_at = GETDATE()
    WHERE id = @id;
END

