CREATE PROCEDURE softDeleteForum
    @id VARCHAR(255)
AS
BEGIN
    UPDATE forums
    SET is_deleted = 1
    WHERE id = @id;
END