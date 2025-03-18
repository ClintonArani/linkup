CREATE OR ALTER PROCEDURE GetPendingRequests
    @userId VARCHAR(255)
AS
BEGIN
    SELECT * FROM connections
    WHERE receiverId = @userId AND status = 'pending'
END

