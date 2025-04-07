import { Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { UploadedFile } from 'express-fileupload';
import { PostWithDetails, PostComment } from '../interfaces/post.interface';

const postService = new PostService();

export class PostController {
    async createPost(req: Request, res: Response): Promise<Response> {
        try {
            const { user_id, content } = req.body;
            const image = req.files?.image as UploadedFile | undefined;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.createPost(user_id, { content }, image);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(201).json(result.post);
        } catch (error) {
            console.error('Error in createPost controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updatePost(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { user_id, content } = req.body;
            const image = req.files?.image as UploadedFile | undefined;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.updatePost(post_id, user_id, { content }, image);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json(result.post);
        } catch (error) {
            console.error('Error in updatePost controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deletePost(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.deletePost(post_id, user_id);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in deletePost controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllPosts(req: Request, res: Response): Promise<Response> {
        try {
            const result = await postService.getAllPosts();

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json(result.posts || []);
        } catch (error) {
            console.error('Error in getAllPosts controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getPostById(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;

            const result = await postService.getPostById(post_id);

            if (result.error) {
                return res.status(404).json({ error: result.error });
            }

            return res.status(200).json(result.post || null);
        } catch (error) {
            console.error('Error in getPostById controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async likePost(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.likePost(post_id, user_id);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in likePost controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async unlikePost(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.unlikePost(post_id, user_id);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in unlikePost controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async addComment(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { user_id, content } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            if (!content) {
                return res.status(400).json({ error: 'Content is required' });
            }

            const result = await postService.addComment(post_id, user_id, { content });

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(201).json(result.comment || null);
        } catch (error) {
            console.error('Error in addComment controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateComment(req: Request, res: Response): Promise<Response> {
        try {
            const { comment_id } = req.params;
            const { user_id, content } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            if (!content) {
                return res.status(400).json({ error: 'Content is required' });
            }

            const result = await postService.updateComment(comment_id, user_id, content);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json(result.comment || null);
        } catch (error) {
            console.error('Error in updateComment controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteComment(req: Request, res: Response): Promise<Response> {
        try {
            const { comment_id } = req.params;
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }

            const result = await postService.deleteComment(comment_id, user_id);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in deleteComment controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getPostComments(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const result = await postService.getPostComments(post_id);
            
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            
            return res.status(200).json(result.comments || []);
        } catch (error) {
            console.error('Error in getPostComments controller:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}