CREATE OR ALTER PROCEDURE GetUserConnections
    @userId VARCHAR(255)
AS
BEGIN
    SELECT * FROM connections
    WHERE (senderId = @userId OR receiverId = @userId)
    AND status = 'accepted'
END

