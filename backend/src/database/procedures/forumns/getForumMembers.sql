CREATE PROCEDURE getForumMembers
    @forum_id VARCHAR(255)
AS
BEGIN
    SELECT u.id, u.firstName, u.lastName, u.email, u.profile
    FROM forum_members fm
    JOIN users u ON fm.user_id = u.id
    WHERE fm.forum_id = @forum_id;
END