CREATE PROCEDURE updatePost
    @id VARCHAR(36),
    @content TEXT,
    @image_url VARCHAR(255)
AS
BEGIN
    UPDATE Posts 
    SET content = @content, 
        image_url = @image_url,
        updated_at = GETDATE()
    WHERE id = @id AND is_deleted = 0;
END;