


CREATE or alter PROCEDURE sendMessage
    @id VARCHAR(255),
    @sender_id VARCHAR(255),
    @receiver_id VARCHAR(255),
    @message TEXT
AS
BEGIN
    -- Insert the message into the messages table
    INSERT INTO messages (id, sender_id, receiver_id, message)
    VALUES (@id, @sender_id, @receiver_id, @message);
END;