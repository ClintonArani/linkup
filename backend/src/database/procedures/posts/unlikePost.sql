CREATE PROCEDURE unlikePost
    @post_id VARCHAR(36),
    @user_id VARCHAR(36)
AS
BEGIN
    DELETE FROM PostLikes
    WHERE post_id = @post_id AND user_id = @user_id;
    
    SELECT @@ROWCOUNT AS success;
END;