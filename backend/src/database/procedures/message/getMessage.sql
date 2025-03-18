

CREATE or alter PROCEDURE getMessages
    @sender_id VARCHAR(255),
    @receiver_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM messages
    WHERE (sender_id = @sender_id AND receiver_id = @receiver_id)
    OR (sender_id = @receiver_id AND receiver_id = @sender_id)
    ORDER BY timestamp ASC;
END;