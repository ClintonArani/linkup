CREATE TABLE attachments (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    application_link VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL, -- User who created the attachment
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

ALTER TABLE attachments ADD is_deleted BIT DEFAULT 0;

CREATE TABLE user_attachments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    attachment_id VARCHAR(255) NOT NULL,
    applied_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (attachment_id) REFERENCES attachments(id)
);

use university