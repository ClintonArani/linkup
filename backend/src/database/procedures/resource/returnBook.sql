CREATE PROCEDURE returnBook
    @resource_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    -- Check if the book is borrowed by the student and not yet returned
    IF EXISTS (
        SELECT 1
        FROM borrowed_books
        WHERE resource_id = @resource_id
          AND user_id = @user_id
          AND is_returned = 0
    )
    BEGIN
        -- Increment the quantity of the resource
        UPDATE resources
        SET quantity = quantity + 1
        WHERE id = @resource_id;

        -- Mark the book as returned
        UPDATE borrowed_books
        SET is_returned = 1
        WHERE resource_id = @resource_id
          AND user_id = @user_id
          AND is_returned = 0;

        -- Return success message
        SELECT 'Book returned successfully' AS message;
    END
    ELSE
    BEGIN
        -- Return error message if the book is not borrowed by the student or already returned
        SELECT 'Unable to return book: Book not borrowed by this student or already returned' AS error;
    END
END;