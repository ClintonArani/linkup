import mssql from 'mssql';
import { v4 } from 'uuid';
import { sqlConfig } from '../config/sqlConfig';
import { Forum, ForumMember, ForumMessage } from '../interfaces/forum.interface';


export class ForumService {
   
    async createForum(forum: Forum, file: any) {
        let pool = await mssql.connect(sqlConfig);
        let forum_id = v4();
    
        // Upload the file to Cloudinary if provided
        let icon_url = null;
        if (file) {
            console.log('File Data:', file.data); // Log the file data
            console.log('File Size:', file.data.length); // Log the file size
    
            try {
                // const uploadResult = await uploadToCloudinary(file);
                // icon_url = uploadResult.secure_url; // Get the Cloudinary URL
            } catch (uploadError) {
                console.error('Error uploading file to Cloudinary:', uploadError);
                throw new Error('Failed to upload file to Cloudinary. Please provide a valid image file.');
            }
        } else {
            throw new Error('No file uploaded. Please provide a forum icon.');
        }
    
        if (pool.connected) {
            try {
                let result = (await pool.request()
                    .input('id', mssql.VarChar, forum_id)
                    .input('title', mssql.VarChar, forum.title)
                    .input('description', mssql.Text, forum.description)
                    .input('icon_url', mssql.VarChar, icon_url) // Pass the Cloudinary URL
                    .input('created_by', mssql.VarChar, forum.created_by)
                    .execute('CreateForum')).rowsAffected; // Ensure the procedure name matches exactly
    
                if (result[0] == 1) {
                    return {
                        message: 'Forum created successfully',
                        forum_id: forum_id,
                        icon_url: icon_url
                    };
                } else {
                    throw new Error('Unable to create forum');
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                if (dbError instanceof Error) {
                    throw new Error('Database error occurred: ' + dbError.message);
                } else {
                    throw new Error('Database error occurred: An unknown error occurred');
                }
            }
        } else {
            throw new Error('Unable to establish database connection');
        }
    }

    async addForumMember(member: ForumMember) {
        let pool = await mssql.connect(sqlConfig);
        let member_id = v4();

        if (pool.connected) {
            let result = (await pool.request()
                .input('id', mssql.VarChar, member_id)
                .input('forum_id', mssql.VarChar, member.forum_id)
                .input('user_id', mssql.VarChar, member.user_id)
                .execute('addForumMember')).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: 'Member added successfully'
                };
            } else {
                return {
                    error: 'Unable to add member'
                };
            }
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async sendForumMessage(message: ForumMessage, file: any) {
        let pool = await mssql.connect(sqlConfig);
        let message_id = v4();
        let file_url = null;
        let file_name = null;

        if (file) {
            // const uploadResult = await uploadToCloudinary(file);
            // file_url = uploadResult.secure_url;
            file_name = file.originalname;
        }

        if (pool.connected) {
            let result = (await pool.request()
                .input('id', mssql.VarChar, message_id)
                .input('forum_id', mssql.VarChar, message.forum_id)
                .input('sender_id', mssql.VarChar, message.sender_id)
                .input('message', mssql.Text, message.message)
                .input('file_url', mssql.VarChar, file_url)
                .input('file_name', mssql.VarChar, file_name)
                .execute('sendForumMessage')).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: 'Message sent successfully'
                };
            } else {
                return {
                    error: 'Unable to send message'
                };
            }
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async getForumMembers(forum_id: string) {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .input('forum_id', mssql.VarChar, forum_id)
                .execute('getForumMembers')).recordset;

            return {
                members: result
            };
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async getForumMessages(forum_id: string) {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .input('forum_id', mssql.VarChar, forum_id)
                .execute('getForumMessages')).recordset;

            return {
                messages: result
            };
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async editForum(forum: Forum, file: any) {
        let pool = await mssql.connect(sqlConfig);
    
        // Upload the file to Cloudinary if provided
        let icon_url = forum.icon_url; // Use existing icon_url if no new file is uploaded
        if (file) {
            // const uploadResult = await uploadToCloudinary(file);
            // icon_url = uploadResult.secure_url; // Get the Cloudinary URL
        }
    
        if (pool.connected) {
            let result = (await pool.request()
                .input('id', mssql.VarChar, forum.id)
                .input('title', mssql.VarChar, forum.title)
                .input('description', mssql.Text, forum.description)
                .input('icon_url', mssql.VarChar, icon_url) // Use the updated or existing icon_url
                .execute('editForum')).rowsAffected;
    
            if (result[0] == 1) {
                return {
                    message: 'Forum updated successfully',
                    icon_url: icon_url // Return the updated icon_url
                };
            } else {
                return {
                    error: 'Unable to update forum'
                };
            }
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async softDeleteForum(forum_id: string) {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .input('id', mssql.VarChar, forum_id)
                .execute('softDeleteForum')).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: 'Forum deleted successfully'
                };
            } else {
                return {
                    error: 'Unable to delete forum'
                };
            }
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async getAllForums(): Promise<any> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .execute('getAllForums')).recordset; // Ensure the stored procedure exists

            return {
                forums: result
            };
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }

    async getForumById(forum_id: string): Promise<any> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .input('forum_id', mssql.VarChar, forum_id)
                .execute('getForumById')).recordset; // Ensure the stored procedure exists

            if (result.length > 0) {
                return {
                    forum: result[0]
                };
            } else {
                return {
                    error: 'Forum not found'
                };
            }
        } else {
            return {
                error: 'Unable to establish connection'
            };
        }
    }
}