import { Request, Response } from 'express';
import { attachmentService } from '../services/attachment.service';
import { attachmentSchema } from '../validators/attachment.validator';
import { sqlConfig } from '../config/sqlConfig';
import mssql from 'mssql'

// Extend the Request type to include the info property from verifyToken
declare module 'express' {
    interface Request {
        info?: {
            id: string;
        };
    }
}

const service = new attachmentService();

export class attachmentController {
    async createAttachment(req: Request, res: Response) {
        try {
            let { title, description, company_name, application_link } = req.body;
            let { error } = attachmentSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            // Use req.info instead of req.user
            if (!req.info || !req.info.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            let result = await service.createAttachment(req.body, req.info.id);

            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllAttachments(req: Request, res: Response) {
        try {
            let result = await service.getAllAttachments();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getSingleAttachment(req: Request, res: Response) {
        try {
            let { attachment_id } = req.params;
            let result = await service.getSingleAttachment(attachment_id);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateAttachment(req: Request, res: Response) {
        try {
            let { attachment_id } = req.params; // Ensure this is correctly extracted
            let updatedAttachment = req.body;
    
            let result = await service.updateAttachment(attachment_id, updatedAttachment);
    
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async applyForAttachment(req: Request, res: Response) {
        try {
            let { attachment_id } = req.params;

            // Use req.info instead of req.user
            if (!req.info || !req.info.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            let user_id = req.info.id;
            let result = await service.applyForAttachment(user_id, attachment_id);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getAttachmentsForUser(req: Request, res: Response) {
        try {
            // Use req.info to get the user ID from the token
            if (!req.info || !req.info.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
    
            let user_id = req.info.id;
            let result = await service.getAttachmentsForUser(user_id);
    
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async softDeleteAttachment(req: Request, res: Response) {
        try {
            const { attachment_id } = req.params;

            // Ensure the user is authorized (e.g., admin or creator of the attachment)
            if (!req.info || !req.info.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // Step 1: Check if the attachment exists and is not already deleted
            let pool = await mssql.connect(sqlConfig);
            let attachmentExists = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT id FROM attachments WHERE id = @attachment_id AND is_deleted = 0");

            if (attachmentExists.recordset.length === 0) {
                return res.status(404).json({ error: "Attachment not found or already deleted" });
            }

            // Step 2: Soft delete the attachment by setting is_deleted to 1
            let result = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("UPDATE attachments SET is_deleted = 1 WHERE id = @attachment_id");

            if (result.rowsAffected[0] === 1) {
                return res.status(200).json({ message: "Attachment soft deleted successfully" });
            } else {
                return res.status(500).json({ error: "Unable to delete attachment" });
            }
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async restoreAttachment(req: Request, res: Response) {
        try {
            const { attachment_id } = req.params;
    
            // Ensure the user is authorized (e.g., admin)
            if (!req.info || !req.info.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
    
            let pool = await mssql.connect(sqlConfig);
    
            // Debug: Log the attachment ID and query
            console.log("Attachment ID:", attachment_id);
            console.log("Query: SELECT id FROM attachments WHERE id = @attachment_id AND is_deleted = 1");
    
            // Step 1: Check if the attachment exists and is deleted
            let attachmentExists = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("SELECT id FROM attachments WHERE id = @attachment_id AND is_deleted = 1");
    
            // Debug: Log the result of the query
            console.log("Query Result:", attachmentExists.recordset);
    
            if (attachmentExists.recordset.length === 0) {
                return res.status(404).json({ error: "Attachment not found or not deleted" });
            }
    
            // Step 2: Restore the attachment by setting is_deleted to 0
            let result = await pool.request()
                .input("attachment_id", mssql.VarChar, attachment_id)
                .query("UPDATE attachments SET is_deleted = 0 WHERE id = @attachment_id");
    
            if (result.rowsAffected[0] === 1) {
                return res.status(200).json({ message: "Attachment restored successfully" });
            } else {
                return res.status(500).json({ error: "Unable to restore attachment" });
            }
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}