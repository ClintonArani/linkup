CREATE PROCEDURE getForumMessages
    @forum_id VARCHAR(255)
AS
BEGIN
    SELECT fm.id, fm.sender_id, fm.message, fm.file_url, fm.file_name, fm.sent_at, u.firstName, u.lastName, u.profile
    FROM forum_messages fm
    JOIN users u ON fm.sender_id = u.id
    WHERE fm.forum_id = @forum_id
    ORDER BY fm.sent_at ASC;
END