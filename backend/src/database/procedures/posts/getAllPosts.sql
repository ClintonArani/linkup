CREATE PROCEDURE getAllPosts
AS
BEGIN
    SELECT p.*, u.firstName, u.lastName, u.profile AS user_profile
    FROM Posts p
    JOIN Users u ON p.user_id = u.id
    WHERE p.is_deleted = 0
    ORDER BY p.created_at DESC;
END;