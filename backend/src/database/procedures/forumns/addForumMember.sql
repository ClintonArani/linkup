CREATE PROCEDURE addForumMember
    @id VARCHAR(255),
    @forum_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    INSERT INTO forum_members (id, forum_id, user_id, joined_at)
    VALUES (@id, @forum_id, @user_id, GETDATE());
END