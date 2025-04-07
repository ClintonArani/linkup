CREATE PROCEDURE deleteComment
    @id VARCHAR(36)
AS
BEGIN
    UPDATE PostComments
    SET is_deleted = 1,
        updated_at = GETDATE()
    WHERE id = @id;
END;