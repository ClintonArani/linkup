CREATE PROCEDURE AddForumMember
    @id VARCHAR(255),
    @forumId VARCHAR(255),
    @userId VARCHAR(255),
    @joinedAt DATETIME
AS
BEGIN
    INSERT INTO forum_members (id, forumId, userId, joinedAt)
    VALUES (@id, @forumId, @userId, @joinedAt);
END;