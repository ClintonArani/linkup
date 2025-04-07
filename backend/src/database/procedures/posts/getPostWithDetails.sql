
CREATE PROCEDURE getPostWithDetails
    @post_id VARCHAR(36)
AS
BEGIN
    -- Get post info
    SELECT p.*, u.firstName, u.lastName, u.profile AS user_profile
    FROM Posts p
    JOIN Users u ON p.user_id = u.id
    WHERE p.id = @post_id AND p.is_deleted = 0;
    
    -- Get likes count
    SELECT COUNT(*) AS like_count
    FROM PostLikes
    WHERE post_id = @post_id;
    
    -- Get comments
    SELECT c.*, u.firstName, u.lastName, u.profile AS user_profile
    FROM PostComments c
    JOIN Users u ON c.user_id = u.id
    WHERE c.post_id = @post_id AND c.is_deleted = 0
    ORDER BY c.created_at ASC;
END;
