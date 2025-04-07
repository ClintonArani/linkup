CREATE PROCEDURE getAllForums
AS
BEGIN
    SELECT * FROM Forums WHERE is_deleted = 0; -- Exclude soft-deleted forums
END