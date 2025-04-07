import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const controller = new ForumController();
const forum_router = Router();

forum_router.post('/create', controller.createForum);
forum_router.post('/add-member', controller.addForumMember);
forum_router.post('/send-message', upload.single('file'), controller.sendForumMessage)
forum_router.get('/:forum_id/members', controller.getForumMembers);
forum_router.get('/:forum_id/messages', controller.getForumMessages);
forum_router.put('/edit', controller.editForum);
forum_router.delete('/delete/:forum_id', controller.softDeleteForum);

forum_router.get('/forums', controller.getAllForums); // Get all forums
forum_router.get('/:forum_id', controller.getForumById); // Get a single forum by ID

export default forum_router;