CREATE OR ALTER PROCEDURE SendConnectionRequest
    @senderId VARCHAR(255),
    @receiverId VARCHAR(255)
AS
BEGIN
    INSERT INTO connections (id, senderId, receiverId, status, createdAt)
    VALUES (NEWID(), @senderId, @receiverId, 'pending', GETDATE())
END

