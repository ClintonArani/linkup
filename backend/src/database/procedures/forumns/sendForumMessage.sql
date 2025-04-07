CREATE PROCEDURE sendForumMessage
    @id VARCHAR(255),
    @forum_id VARCHAR(255),
    @sender_id VARCHAR(255),
    @message TEXT,
    @file_url VARCHAR(255),
    @file_name VARCHAR(255)
AS
BEGIN
    INSERT INTO forum_messages (id, forum_id, sender_id, message, file_url, file_name, sent_at)
    VALUES (@id, @forum_id, @sender_id, @message, @file_url, @file_name, GETDATE());
END


drop procedure sendForumMessage