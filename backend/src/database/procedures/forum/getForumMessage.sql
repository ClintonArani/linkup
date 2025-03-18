CREATE PROCEDURE GetForumMessages
    @forumId VARCHAR(255)
AS
BEGIN
    SELECT * FROM forum_messages WHERE forumId = @forumId ORDER BY sentAt ASC;
END;