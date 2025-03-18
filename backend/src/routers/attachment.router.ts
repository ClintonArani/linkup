import { Router } from 'express';
import { attachmentController } from '../controllers/attachment.controller';
import { verifyToken } from '../middlewares/verifyToken';

const controller = new attachmentController();
const attachment_router = Router();

attachment_router.post('/create', verifyToken, controller.createAttachment);
attachment_router.get('/all', verifyToken, controller.getAllAttachments);
attachment_router.get('/:attachment_id', verifyToken, controller.getSingleAttachment);
attachment_router.patch('/update/:attachment_id', verifyToken, controller.updateAttachment); // Ensure this line is correct
attachment_router.post('/apply/:attachment_id', verifyToken, controller.applyForAttachment);
attachment_router.get('/user/attachments', verifyToken, controller.getAttachmentsForUser);
attachment_router.patch('/soft-delete/:attachment_id', verifyToken, controller.softDeleteAttachment);
attachment_router.patch('/restore/:attachment_id', verifyToken, controller.restoreAttachment);

export default attachment_router;