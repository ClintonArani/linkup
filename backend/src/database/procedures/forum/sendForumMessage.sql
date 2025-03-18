CREATE PROCEDURE SendForumMessage
    @id VARCHAR(255),
    @forumId VARCHAR(255),
    @senderId VARCHAR(255),
    @message TEXT,
    @fileUrl VARCHAR(255),
    @fileName VARCHAR(255),
    @sentAt DATETIME
AS
BEGIN
    INSERT INTO forum_messages (id, forumId, senderId, message, fileUrl, fileName, sentAt)
    VALUES (@id, @forumId, @senderId, @message, @fileUrl, @fileName, @sentAt);
END;