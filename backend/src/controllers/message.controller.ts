import { Request, Response } from 'express';
import { messageService } from '../services/message.service';

const service = new messageService();

export class messageController {
    async sendMessage(req: Request, res: Response) {
        try {
            const { sender_id, receiver_id, message } = req.body;
            const result = await service.sendMessage(sender_id, receiver_id, message);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const { sender_id, receiver_id } = req.params;
            const result = await service.getMessages(sender_id, receiver_id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve messages' });
        }
    }
}