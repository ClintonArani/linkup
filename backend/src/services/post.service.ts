import { v4 } from 'uuid';
import mssql from 'mssql';
import { sqlConfig } from '../config/sqlConfig';
import { Post, PostWithDetails, PostComment, CreatePostInput, UpdatePostInput, AddCommentInput } from '../interfaces/post.interface';
import { UploadedFile } from 'express-fileupload';
import { handleFileUpload } from '../utils/fileUpload.util';

// Helper function to safely access recordsets
function getRecordsets(result: mssql.IResult<any>): mssql.IRecordSet<any>[] | null {
    if (!result.recordsets) return null;
    if (Array.isArray(result.recordsets)) return result.recordsets;
    return null;
}

export class PostService {
    async createPost(user_id: string, postData: CreatePostInput, image?: UploadedFile): Promise<{ post?: PostWithDetails, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);
            const post_id = v4();
            let image_url = null;

            if (image) {
                image_url = await handleFileUpload(image);
            }

            await pool.request()
                .input('id', mssql.VarChar, post_id)
                .input('user_id', mssql.VarChar, user_id)
                .input('content', mssql.Text, postData.content)
                .input('image_url', mssql.VarChar, image_url)
                .execute('createPost');

            const result = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .execute('getPostWithDetails');

            const post = result.recordset[0] as PostWithDetails;
            const recordsets = getRecordsets(result);

            if (recordsets && recordsets.length >= 3) {
                post.like_count = recordsets[1][0]?.like_count || 0;
                post.comments = recordsets[2] as PostComment[];
            } else {
                post.like_count = 0;
                post.comments = [];
            }

            return { post };
        } catch (error) {
            console.error('Error creating post:', error);
            return { error: 'Failed to create post' };
        }
    }

    async updatePost(post_id: string, user_id: string, postData: UpdatePostInput, image?: UploadedFile): Promise<{ post?: PostWithDetails, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            const currentPost = (await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .query('SELECT * FROM Posts WHERE id = @post_id AND is_deleted = 0')).recordset[0];

            if (!currentPost) {
                return { error: 'Post not found' };
            }

            if (currentPost.user_id !== user_id) {
                return { error: 'Unauthorized to update this post' };
            }

            let image_url = currentPost.image_url;

            if (image) {
                const oldImagePath = image_url || undefined;
                image_url = await handleFileUpload(image, oldImagePath);
            }

            await pool.request()
                .input('id', mssql.VarChar, post_id)
                .input('content', mssql.Text, postData.content || currentPost.content)
                .input('image_url', mssql.VarChar, image_url)
                .execute('updatePost');

            const result = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .execute('getPostWithDetails');

            const post = result.recordset[0] as PostWithDetails;
            const recordsets = getRecordsets(result);

            if (recordsets && recordsets.length >= 3) {
                post.like_count = recordsets[1][0]?.like_count || 0;
                post.comments = recordsets[2] as PostComment[];
            } else {
                post.like_count = 0;
                post.comments = [];
            }

            return { post };
        } catch (error) {
            console.error('Error updating post:', error);
            return { error: 'Failed to update post' };
        }
    }

    async getPostById(post_id: string): Promise<{ post?: PostWithDetails, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            const result = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .execute('getPostWithDetails');

            if (result.recordset.length === 0) {
                return { error: 'Post not found' };
            }

            const post = result.recordset[0] as PostWithDetails;
            const recordsets = getRecordsets(result);

            if (recordsets && recordsets.length >= 3) {
                post.like_count = recordsets[1][0]?.like_count || 0;
                post.comments = recordsets[2] as PostComment[];
            } else {
                post.like_count = 0;
                post.comments = [];
            }

            return { post };
        } catch (error) {
            console.error('Error getting post:', error);
            return { error: 'Failed to get post' };
        }
    }
    async getAllPosts(): Promise<{ posts?: PostWithDetails[], error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            const result = await pool.request().execute('getAllPosts');

            return { posts: result.recordset };
        } catch (error) {
            console.error('Error getting posts:', error);
            return { error: 'Failed to get posts' };
        }
    }


    async likePost(post_id: string, user_id: string): Promise<{ success?: boolean, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // Check if post exists
            const post = (await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .query('SELECT 1 FROM Posts WHERE id = @post_id AND is_deleted = 0')).recordset[0];

            if (!post) {
                return { error: 'Post not found' };
            }

            // Like the post
            const result = await pool.request()
                .input('id', mssql.VarChar, v4())
                .input('post_id', mssql.VarChar, post_id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('likePost');

            if (result.recordset[0].success === 0) {
                return { error: 'Post already liked' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error liking post:', error);
            return { error: 'Failed to like post' };
        }
    }

    async unlikePost(post_id: string, user_id: string): Promise<{ success?: boolean, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // Unlike the post
            const result = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('unlikePost');

            if (result.recordset[0].success === 0) {
                return { error: 'Post not liked' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error unliking post:', error);
            return { error: 'Failed to unlike post' };
        }
    }

    async addComment(post_id: string, user_id: string, commentData: AddCommentInput): Promise<{ comment?: PostComment, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // Check if post exists
            const post = (await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .query('SELECT 1 FROM Posts WHERE id = @post_id AND is_deleted = 0')).recordset[0];

            if (!post) {
                return { error: 'Post not found' };
            }

            // Add the comment
            const comment_id = v4();
            const result = await pool.request()
                .input('id', mssql.VarChar, comment_id)
                .input('post_id', mssql.VarChar, post_id)
                .input('user_id', mssql.VarChar, user_id)
                .input('content', mssql.Text, commentData.content)
                .execute('addComment');

            return { comment: result.recordset[0] };
        } catch (error) {
            console.error('Error adding comment:', error);
            return { error: 'Failed to add comment' };
        }
    }

    async updateComment(comment_id: string, user_id: string, content: string): Promise<{ comment?: PostComment, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // First check ownership
            const comment = (await pool.request()
                .input('comment_id', mssql.VarChar, comment_id)
                .query('SELECT * FROM PostComments WHERE id = @comment_id AND is_deleted = 0')).recordset[0];

            if (!comment) {
                return { error: 'Comment not found' };
            }

            if (comment.user_id !== user_id) {
                return { error: 'Unauthorized to update this comment' };
            }

            // Update the comment
            const result = await pool.request()
                .input('id', mssql.VarChar, comment_id)
                .input('content', mssql.Text, content)
                .execute('updateComment');

            return { comment: result.recordset[0] };
        } catch (error) {
            console.error('Error updating comment:', error);
            return { error: 'Failed to update comment' };
        }
    }

    async deleteComment(comment_id: string, user_id: string): Promise<{ success?: boolean, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // First check ownership
            const comment = (await pool.request()
                .input('comment_id', mssql.VarChar, comment_id)
                .query('SELECT * FROM PostComments WHERE id = @comment_id AND is_deleted = 0')).recordset[0];

            if (!comment) {
                return { error: 'Comment not found' };
            }

            // Allow post owner or comment owner to delete
            const post = (await pool.request()
                .input('post_id', mssql.VarChar, comment.post_id)
                .query('SELECT * FROM Posts WHERE id = @post_id AND is_deleted = 0')).recordset[0];

            if (comment.user_id !== user_id && post.user_id !== user_id) {
                return { error: 'Unauthorized to delete this comment' };
            }

            // Delete the comment (soft delete)
            await pool.request()
                .input('id', mssql.VarChar, comment_id)
                .execute('deleteComment');

            return { success: true };
        } catch (error) {
            console.error('Error deleting comment:', error);
            return { error: 'Failed to delete comment' };
        }
    }
    async deletePost(post_id: string, user_id: string): Promise<{ success?: boolean; error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);

            // First check ownership
            const post = (await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .query('SELECT * FROM Posts WHERE id = @post_id AND is_deleted = 0')).recordset[0];

            if (!post) {
                return { error: 'Post not found' };
            }

            if (post.user_id !== user_id) {
                return { error: 'Unauthorized to delete this post' };
            }

            // Soft delete the post
            await pool.request()
                .input('id', mssql.VarChar, post_id)
                .execute('deletePost');

            // Delete associated image if exists
            if (post.image_url) {
                try {
                    const fs = require('fs').promises;
                    await fs.unlink(post.image_url);
                } catch (err) {
                    console.error('Error deleting post image:', err);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting post:', error);
            return { error: 'Failed to delete post' };
        }
    }
    async getPostComments(post_id: string): Promise<{ comments?: PostComment[], error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);
    
            const result = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .query(`
                    SELECT c.*, u.firstName, u.lastName, u.profile AS user_profile
                    FROM PostComments c
                    JOIN Users u ON c.user_id = u.id
                    WHERE c.post_id = @post_id AND c.is_deleted = 0
                    ORDER BY c.created_at ASC
                `);
    
            return { comments: result.recordset };
        } catch (error) {
            console.error('Error getting post comments:', error);
            return { error: 'Failed to get post comments' };
        }
    }
}
