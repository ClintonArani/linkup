import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import fileUpload from 'express-fileupload';

const controller = new PostController();
const post_router = Router();

// Post CRUD operations
post_router.post('/create', controller.createPost);
post_router.get('/all', controller.getAllPosts);
post_router.get('/:post_id', controller.getPostById);
post_router.put('/:post_id', controller.updatePost);
post_router.delete('/:post_id', controller.deletePost);

// Post interactions
post_router.post('/:post_id/like', controller.likePost);
post_router.delete('/:post_id/like', controller.unlikePost);

// Comments operations
post_router.post('/:post_id/comments', controller.addComment);
post_router.put('/comments/:comment_id', controller.updateComment);
post_router.delete('/comments/:comment_id', controller.deleteComment);

// Image upload route
post_router.post('/:post_id/upload-image', fileUpload(), controller.updatePost);
post_router.get('/:post_id/comments', controller.getPostComments);

export default post_router;