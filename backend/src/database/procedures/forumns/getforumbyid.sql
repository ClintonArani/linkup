CREATE PROCEDURE getForumById
    @forum_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM Forums WHERE id = @forum_id AND is_deleted = 0; -- Exclude soft-deleted forums
END