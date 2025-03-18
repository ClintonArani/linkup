CREATE OR ALTER PROCEDURE UpdateConnectionStatus
    @connectionId VARCHAR(255),
    @status VARCHAR(50)
AS
BEGIN
    UPDATE connections
    SET status = @status, updatedAt = GETDATE()
    WHERE id = @connectionId
END

