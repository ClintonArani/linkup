CREATE OR ALTER PROCEDURE GetConnection
    @senderId VARCHAR(255),
    @receiverId VARCHAR(255)
AS
BEGIN
    SELECT * FROM connections
    WHERE (senderId = @senderId AND receiverId = @receiverId)
    OR (senderId = @receiverId AND receiverId = @senderId)
END