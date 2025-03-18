import mssql from 'mssql';
import { v4 } from 'uuid';
import { sqlConfig } from '../config/sqlConfig';
import { Attachment } from '../interfaces/attachments';


export class attachmentService {
    async createAttachment(attachment: Attachment, created_by: string) {
        let pool = await mssql.connect(sqlConfig);

        let attachment_id = v4();
        let created_at = new Date();

        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, attachment_id)
                .input("title", mssql.VarChar, attachment.title)
                .input("description", mssql.Text, attachment.description)
                .input("company_name", mssql.VarChar, attachment.company_name)
                .input("application_link", mssql.VarChar, attachment.application_link)
                .input("created_by", mssql.VarChar, created_by)
                .input("created_at", mssql.DateTime, created_at)
                .execute("createAttachment")).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: "Attachment created successfully"
                };
            } else {
                return {
                    error: "Unable to create attachment"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async getAllAttachments() {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            let result = await pool.request()
                .query("SELECT * FROM attachments WHERE is_deleted = 0");
    
            if (result.recordset.length === 0) {
                return {
                    message: "No attachments available"
                };
            } else {
                return {
                    attachments: result.recordset
                };
            }
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }

    async getSingleAttachment(attachment_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            let result = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT * FROM attachments WHERE id = @attachment_id AND is_deleted = 0");
    
            if (result.recordset.length === 0) {
                return {
                    error: "Attachment not found or deleted"
                };
            } else {
                return {
                    attachment: result.recordset[0]
                };
            }
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }

    async updateAttachment(attachment_id: string, updatedAttachment: Partial<Attachment>) {
        let pool = await mssql.connect(sqlConfig);
    
        let query = `
            UPDATE attachments SET
                title = @title,
                description = @description,
                company_name = @company_name,
                application_link = @application_link,
                updated_at = GETDATE()
            WHERE id = @attachment_id
        `;
    
        try {
            let result = await pool.request()
                .input('attachment_id', mssql.VarChar, attachment_id)
                .input('title', mssql.VarChar, updatedAttachment.title)
                .input('description', mssql.Text, updatedAttachment.description)
                .input('company_name', mssql.VarChar, updatedAttachment.company_name)
                .input('application_link', mssql.VarChar, updatedAttachment.application_link)
                .query(query);
    
            if (result.rowsAffected[0] === 1) {
                return {
                    message: "Attachment updated successfully"
                };
            } else {
                return {
                    error: "Unable to update attachment"
                };
            }
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }

    async applyForAttachment(user_id: string, attachment_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        let user_attachment_id = v4();
        let applied_at = new Date();
    
        try {
            // Check if the attachment exists
            let attachmentExists = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT id FROM attachments WHERE id = @attachment_id");
    
            if (attachmentExists.recordset.length === 0) {
                return {
                    error: "Attachment not found"
                };
            }
    
            // Check if the user has already applied for this attachment
            let alreadyApplied = await pool.request()
                .input("user_id", mssql.VarChar, user_id)
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT id FROM user_attachments WHERE user_id = @user_id AND attachment_id = @attachment_id");
    
            if (alreadyApplied.recordset.length > 0) {
                return {
                    error: "You have already applied for this attachment"
                };
            }
    
            // Insert into user_attachments table
            let result = await pool.request()
                .input("id", mssql.VarChar, user_attachment_id)
                .input("user_id", mssql.VarChar, user_id)
                .input("attachment_id", mssql.VarChar, attachment_id)
                .input("applied_at", mssql.DateTime, applied_at)
                .query(`
                    INSERT INTO user_attachments (id, user_id, attachment_id, applied_at)
                    VALUES (@id, @user_id, @attachment_id, @applied_at)
                `);
    
            if (result.rowsAffected[0] === 1) {
                return {
                    message: "Applied for attachment successfully"
                };
            } else {
                return {
                    error: "Unable to apply for attachment"
                };
            }
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }
    async getAttachmentsForUser(user_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            // Step 1: Get all attachment IDs the user has applied for
            let appliedAttachments = await pool.request()
                .input("user_id", mssql.VarChar, user_id)
                .query(`
                    SELECT attachment_id 
                    FROM user_attachments 
                    WHERE user_id = @user_id
                `);
    
            if (appliedAttachments.recordset.length === 0) {
                return {
                    message: "No attachments found for this user"
                };
            }
    
            // Step 2: Extract attachment IDs from the result
            const attachmentIds = appliedAttachments.recordset.map(row => row.attachment_id);
    
            // Step 3: Construct the SQL query with dynamic input parameters
            const query = `
                SELECT * 
                FROM attachments 
                WHERE id IN (${attachmentIds.map((_, index) => `@attachmentId${index}`).join(", ")})
            `;
    
            // Step 4: Add input parameters for the attachment IDs
            const request = pool.request();
            attachmentIds.forEach((id, index) => {
                request.input(`attachmentId${index}`, mssql.VarChar, id);
            });
    
            // Step 5: Execute the query
            let attachments = await request.query(query);
    
            if (attachments.recordset.length === 0) {
                return {
                    message: "No attachments found for this user"
                };
            }
    
            return {
                attachments: attachments.recordset
            };
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }
    async deleteAttachment(attachment_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            // Step 1: Check if the attachment exists
            let attachmentExists = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT id FROM attachments WHERE id = @attachment_id AND is_deleted = 0");
    
            if (attachmentExists.recordset.length === 0) {
                return {
                    error: "Attachment not found or already deleted"
                };
            }
    
            // Step 2: Soft delete the attachment by setting is_deleted to 1
            let result = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("UPDATE attachments SET is_deleted = 1 WHERE id = @attachment_id");
    
            if (result.rowsAffected[0] === 1) {
                return {
                    message: "Attachment soft deleted successfully"
                };
            } else {
                return {
                    error: "Unable to delete attachment"
                };
            }
        } catch (error: any) {
            return {
                error: error.message
            };
        }
    }
}