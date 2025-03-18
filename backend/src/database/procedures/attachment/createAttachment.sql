-- Create Attachment
CREATE PROCEDURE createAttachment
    @id VARCHAR(255),
    @title VARCHAR(255),
    @description TEXT,
    @company_name VARCHAR(255),
    @application_link VARCHAR(255),
    @created_by VARCHAR(255),
    @created_at DATETIME
AS
BEGIN
    INSERT INTO attachments (id, title, description, company_name, application_link, created_by, created_at)
    VALUES (@id, @title, @description, @company_name, @application_link, @created_by, @created_at);
END;

