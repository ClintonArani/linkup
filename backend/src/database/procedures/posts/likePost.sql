CREATE PROCEDURE likePost
    @id VARCHAR(36),
    @post_id VARCHAR(36),
    @user_id VARCHAR(36)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM PostLikes WHERE post_id = @post_id AND user_id = @user_id)
    BEGIN
        INSERT INTO PostLikes (id, post_id, user_id)
        VALUES (@id, @post_id, @user_id);
        
        SELECT 1 AS success;
    END
    ELSE
    BEGIN
        SELECT 0 AS success;
    END
END;