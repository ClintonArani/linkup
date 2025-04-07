CREATE PROCEDURE deletePost
    @id VARCHAR(36)
AS
BEGIN
    UPDATE Posts 
    SET is_deleted = 1,
        updated_at = GETDATE()
    WHERE id = @id;
END;