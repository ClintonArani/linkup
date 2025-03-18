CREATE PROCEDURE getAllUsers
AS
BEGIN
    SELECT * FROM users WHERE role = 'student'
END