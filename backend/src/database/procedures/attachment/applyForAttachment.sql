-- Apply for Attachment
CREATE PROCEDURE applyForAttachment
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @attachment_id VARCHAR(255),
    @applied_at DATETIME
AS
BEGIN
    INSERT INTO user_attachments (id, user_id, attachment_id, applied_at)
    VALUES (@id, @user_id, @attachment_id, @applied_at);
END;