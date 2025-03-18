import { pool } from 'mssql';
import { Forum, ForumMember, ForumMessage } from '../interfaces/forum.interface';

export default class ForumService {
    // Create a new forum
    async createForum(forum: Forum): Promise<void> {
        const query = `EXEC CreateForum @id, @title, @description, @iconUrl, @createdBy, @createdAt`;
        await pool.request()
            .input('id', forum.id)
            .input('title', forum.title)
            .input('description', forum.description)
            .input('iconUrl', forum.iconUrl)
            .input('createdBy', forum.createdBy)
            .input('createdAt', forum.createdAt)
            .query(query);
    }

    // Add a member to a forum
    async addForumMember(member: ForumMember): Promise<void> {
        const query = `EXEC AddForumMember @id, @forumId, @userId, @joinedAt`;
        await pool.request()
            .input('id', member.id)
            .input('forumId', member.forumId)
            .input('userId', member.userId)
            .input('joinedAt', member.joinedAt)
            .query(query);
    }

    // Send a message to a forum
    async sendForumMessage(message: ForumMessage): Promise<void> {
        const query = `EXEC SendForumMessage @id, @forumId, @senderId, @message, @fileUrl, @fileName, @sentAt`;
        await pool.request()
            .input('id', message.id)
            .input('forumId', message.forumId)
            .input('senderId', message.senderId)
            .input('message', message.message)
            .input('fileUrl', message.fileUrl)
            .input('fileName', message.fileName)
            .input('sentAt', message.sentAt)
            .query(query);
    }

    // Get all forums
    async getForums(): Promise<Forum[]> {
        const query = `EXEC GetForums`;
        const result = await pool.request().query(query);
        return result.recordset;
    }

    // Get forum members
    async getForumMembers(forumId: string): Promise<ForumMember[]> {
        const query = `EXEC GetForumMembers @forumId`;
        const result = await pool.request()
            .input('forumId', forumId)
            .query(query);
        return result.recordset;
    }

    // Get forum messages
    async getForumMessages(forumId: string): Promise<ForumMessage[]> {
        const query = `EXEC GetForumMessages @forumId`;
        const result = await pool.request()
            .input('forumId', forumId)
            .query(query);
        return result.recordset;
    }
}