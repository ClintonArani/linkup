CREATE PROCEDURE updateComment
    @id VARCHAR(36),
    @content TEXT
AS
BEGIN
    UPDATE PostComments
    SET content = @content,
        updated_at = GETDATE()
    WHERE id = @id AND is_deleted = 0;
    
    SELECT c.*, u.firstName, u.lastName, u.profile AS user_profile
    FROM PostComments c
    JOIN Users u ON c.user_id = u.id
    WHERE c.id = @id;
END;