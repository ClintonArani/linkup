import { Router } from 'express';
import { messageController } from '../controllers/message.controller';

const controller = new messageController();
const message_router = Router();

message_router.post('/send', controller.sendMessage);
message_router.get('/:sender_id/:receiver_id', controller.getMessages);

export default message_router;