CREATE PROCEDURE createPost
    @id VARCHAR(36),
    @user_id VARCHAR(36),
    @content TEXT,
    @image_url VARCHAR(255)
AS
BEGIN
    INSERT INTO Posts (id, user_id, content, image_url)
    VALUES (@id, @user_id, @content, @image_url);
END;