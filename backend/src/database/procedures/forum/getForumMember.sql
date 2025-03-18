CREATE PROCEDURE GetForumMembers
    @forumId VARCHAR(255)
AS
BEGIN
    SELECT * FROM forum_members WHERE forumId = @forumId;
END;