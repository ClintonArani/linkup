CREATE PROCEDURE addComment
    @id VARCHAR(36),
    @post_id VARCHAR(36),
    @user_id VARCHAR(36),
    @content TEXT
AS
BEGIN
    INSERT INTO PostComments (id, post_id, user_id, content)
    VALUES (@id, @post_id, @user_id, @content);
    
    SELECT c.*, u.firstName, u.lastName, u.profile AS user_profile
    FROM PostComments c
    JOIN Users u ON c.user_id = u.id
    WHERE c.id = @id;
END;