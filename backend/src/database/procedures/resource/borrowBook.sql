CREATE PROCEDURE borrowBook
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @resource_id VARCHAR(255),
    @borrowed_date DATE,
    @return_date DATE
AS
BEGIN
    -- Decrement the quantity of the resource
    UPDATE resources
    SET quantity = quantity - 1
    WHERE id = @resource_id AND quantity > 0;

    -- Insert the borrowed book record
    INSERT INTO borrowed_books (id, user_id, resource_id, borrowed_date, return_date)
    VALUES (@id, @user_id, @resource_id, @borrowed_date, @return_date);
END;