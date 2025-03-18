import express from 'express';
import ForumController from '../controllers/forum.controller';

const router = express.Router();
const forumController = new ForumController();

router.post('/forums/create', forumController.createForum);
router.post('/forums/add-member', forumController.addForumMember);
router.post('/forums/send-message', forumController.sendForumMessage);
router.get('/forums/all-forums', forumController.getForums);
router.get('/forums/members/:forumId', forumController.getForumMembers);
router.get('/forums/messages/:forumId', forumController.getForumMessages);

export default router;