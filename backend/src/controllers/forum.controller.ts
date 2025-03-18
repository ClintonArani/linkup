import { Request, Response } from 'express';
import ForumService from '../services/forum.service';
import { Forum, ForumMember, ForumMessage } from '../interfaces/forum.interface';


export default class ForumController {
    private forumService = new ForumService();

    // Create a new forum
    async createForum(req: Request, res: Response) {
        const forum: Forum = req.body;
        try {
            await this.forumService.createForum(forum);
            res.status(201).json({ message: 'Forum created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create forum' });
        }
    }

    // Add a member to a forum
    async addForumMember(req: Request, res: Response) {
        const member: ForumMember = req.body;
        try {
            await this.forumService.addForumMember(member);
            res.status(201).json({ message: 'Member added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add member' });
        }
    }

    // Send a message to a forum
    async sendForumMessage(req: Request, res: Response) {
        const message: ForumMessage = req.body;
        try {
            await this.forumService.sendForumMessage(message);
            res.status(201).json({ message: 'Message sent successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    // Get all forums
    async getForums(req: Request, res: Response) {
        try {
            const forums = await this.forumService.getForums();
            res.status(200).json(forums);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch forums' });
        }
    }

    // Get forum members
    async getForumMembers(req: Request, res: Response) {
        const { forumId } = req.params;
        try {
            const members = await this.forumService.getForumMembers(forumId);
            res.status(200).json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch forum members' });
        }
    }

    // Get forum messages
    async getForumMessages(req: Request, res: Response) {
        const { forumId } = req.params;
        try {
            const messages = await this.forumService.getForumMessages(forumId);
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch forum messages' });
        }
    }
}