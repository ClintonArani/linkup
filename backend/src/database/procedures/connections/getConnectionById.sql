CREATE OR ALTER PROCEDURE GetConnectionById
    @connectionId VARCHAR(255)
AS
BEGIN
    SELECT * FROM connections WHERE id = @connectionId
END

