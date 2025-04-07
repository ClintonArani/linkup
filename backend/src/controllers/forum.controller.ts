import { Request, Response } from 'express';
import { ForumService } from '../services/forum.service';
import { Forum, ForumMember, ForumMessage } from '../interfaces/forum.interface';

let service = new ForumService();

export class ForumController {
    async createForum(req: Request, res: Response) {
        try {
            console.log('Request Body:', req.body); // Log the request body
            console.log('Request Files:', req.files); // Log the uploaded files
    
            const { title, description, created_by } = req.body;
            const file = req.files?.icon; // Get the uploaded file
    
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded. Please provide a forum icon.' });
            }
    
            const forum = { title, description, created_by };
            const result = await service.createForum(forum, file);
    
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error in createForum:', error); // Log the error
            return res.status(500).json({
                error: (error as Error).message || 'An unknown error occurred'
            });
        }
    }
    async addForumMember(req: Request, res: Response) {
        try {
            let member: ForumMember = req.body;
            let result = await service.addForumMember(member);

            return res.status(201).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }

    async sendForumMessage(req: Request, res: Response) {
        try {
            let message: ForumMessage = req.body;
            let file = req.file;
            let result = await service.sendForumMessage(message, file);

            return res.status(201).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }

    async getForumMembers(req: Request, res: Response) {
        try {
            let { forum_id } = req.params;
            let result = await service.getForumMembers(forum_id);

            return res.status(200).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }

    async getForumMessages(req: Request, res: Response) {
        try {
            let { forum_id } = req.params;
            let result = await service.getForumMessages(forum_id);

            return res.status(200).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }

    async editForum(req: Request, res: Response) {
        try {
            const { id, title, description, created_by } = req.body; // Include created_by
            const file = req.files?.icon; // Get the uploaded file
    
            const forum: Forum = { id, title, description, created_by }; // Include created_by
            const result = await service.editForum(forum, file);
    
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: error.message
                });
            } else {
                return res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async softDeleteForum(req: Request, res: Response) {
        try {
            let { forum_id } = req.params;
            let result = await service.softDeleteForum(forum_id);

            return res.status(200).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }
    async getAllForums(req: Request, res: Response) {
        try {
            let result = await service.getAllForums();

            if (result.error) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message || 'An unknown error occurred'
            });
        }
    }

    async getForumById(req: Request, res: Response) {
        try {
            let { forum_id } = req.params;
            let result = await service.getForumById(forum_id);

            if (result.error) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message || 'An unknown error occurred'
            });
        }
    }
}