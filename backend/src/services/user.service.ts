import lodash from 'lodash'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcryptjs'

import { sqlConfig } from '../config/sqlConfig';
import { User} from '../interfaces/user.interface';
import { EmailService } from './email.service';
import { UserProfile } from '../interfaces/userprofile';



export class userService{
    [x: string]: any;

    async registerUser(user: User) {
        let pool = await mssql.connect(sqlConfig);
    
        let user_id = v4();
        let hashedPassword = bcrypt.hashSync(user.password, 6);
        let createdAt = new Date();  
    
        if (pool.connected) {
            // Check if email exists
            let emailExists = (await pool.request().query(`SELECT * FROM Users WHERE email = '${user.email}'`)).recordset;
    
            if (!lodash.isEmpty(emailExists)) {
                return {
                    error: "Email already in use"
                };
            }
    
            let phoneNoExists = (await pool.request().query(`SELECT * FROM Users WHERE phoneNumber = '${user.phoneNumber}'`)).recordset;
    
            if (!lodash.isEmpty(phoneNoExists)) {
                return {
                    error: "Phone number already in use"
                };
            }
    
            let result = (await pool.request()
            .input("id", mssql.VarChar, user_id)
            .input("firstName", user.firstName)
            .input("lastName", user.lastName)
            .input("phoneNumber", user.phoneNumber)
            .input("email", user.email)
            .input("password", hashedPassword)
            .input("createdAt", mssql.DateTime,createdAt) 
            .execute("registerUser")).rowsAffected;
            
            if (result[0] == 1) {
                return {
                    message: "Account created successfully"
                };
            } else {
                return {
                    error: "Unable to create Account"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }
    
    async fetchAllUsers() {
        let pool = await mssql.connect(sqlConfig);
    
        let result = (await pool.request()
            .query("SELECT * FROM Users WHERE isDelete = 0")).recordset; // Only fetch non-deleted users
    
        if (result.length == 0) {
            return {
                message: "No users at the moment"
            };
        } else {
            return {
                users: result
            };
        }
    }
    async fetchSingleUser(user_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        let result = (await pool.request()
            .input("user_id", mssql.VarChar, user_id)
            .query("SELECT * FROM Users WHERE id = @user_id AND isDelete = 0")).recordset; // Only fetch if not deleted
    
        if (result.length === 0) {
            return {
                error: "User not found or has been deleted"
            };
        } else {
            return {
                user: result[0]
            };
        }
    }
    async switchRoles(user_id: string): Promise<{ message?: string, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);
    
            // Fetch the current role of the user
            let currentRoleResult = await pool.request()
                .input("user_id", mssql.VarChar, user_id)
                .query("SELECT role FROM Users WHERE id = @user_id");
    
            // Check if the user was found
            if (!currentRoleResult.recordset || currentRoleResult.recordset.length === 0) {
                return {
                    error: "User not found"
                };
            }
    
            // Determine the new role
            const currentRole = currentRoleResult.recordset[0].role;
            const newRole = (currentRole === "student") ? "admin" : "student";
    
            // Update the user's role
            let updateResult = await pool.request()
                .input("user_id", mssql.VarChar, user_id)
                .input("newRole", mssql.VarChar, newRole)
                .query("UPDATE Users SET role = @newRole WHERE id = @user_id");
    
            // Check if the update was successful
            if (updateResult.rowsAffected[0] === 1) {
                return {
                    message: "Role switched successfully"
                };
            } else {
                return {
                    error: "Unable to switch role"
                };
            }
        } catch (error) {
            // Handle the error and log it
            if (error instanceof Error) {
                console.error("Error updating user role:", error.message);
                return {
                    error: `Error updating user role: ${error.message}`
                };
            } else {
                console.error("Unexpected error:", error);
                return {
                    error: "Unexpected error occurred while updating user role."
                };
            }
        }
    }

    async deleteUser(user_id: string): Promise<{ message?: string; error?: string }> {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            // Update the isDelete column to 1 (true) to mark the user as deleted
            let result = await pool.request()
                .input("user_id", mssql.VarChar, user_id)
                .query("UPDATE Users SET isDelete = 1 WHERE id = @user_id");
    
            if (result.rowsAffected[0] === 1) {
                return {
                    message: "User deleted successfully"
                };
            } else {
                return {
                    error: "User not found or already deleted"
                };
            }
        } catch (error) {
            // Handle the error and log it
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error("Error deleting user:", errorMessage);
            return {
                error: `Error deleting user: ${errorMessage}`
            };
        }
    }
    async updateUser(user_id: string, updatedUser: Partial<User>): Promise<{ message?: string; error?: string }> {
        let pool = await mssql.connect(sqlConfig);
    
        // Hash the password if it's being updated
        let hashedPassword = updatedUser.password ? bcrypt.hashSync(updatedUser.password, 6) : undefined;
    
        // Prepare the SQL update query
        let query = `
            UPDATE Users SET
                firstName = @firstName,
                lastName = @lastName,
                phoneNumber = @phoneNumber,
                email = @email,
                ${hashedPassword ? 'password = @password,' : ''}
                role = @role,
                isUpdated = 1, -- Set isUpdated to 1 (true)
                updatedAt = GETDATE() -- Use GETDATE() to set updatedAt to the current timestamp
            WHERE id = @user_id
        `;
    
        try {
            let request = pool.request()
                .input('user_id', mssql.VarChar, user_id)
                .input('firstName', mssql.VarChar, updatedUser.firstName)
                .input('lastName', mssql.VarChar, updatedUser.lastName)
                .input('phoneNumber', mssql.VarChar, updatedUser.phoneNumber)
                .input('email', mssql.VarChar, updatedUser.email)
                .input('role', mssql.VarChar, updatedUser.role);
    
            if (hashedPassword) {
                request.input('password', mssql.VarChar, hashedPassword);
            }
    
            let result = await request.query(query);
    
            if (result.rowsAffected[0] === 1) {
                return {
                    message: "User updated successfully"
                };
            } else {
                return {
                    error: "Unable to update user"
                };
            }
        } catch (error) {
            // Handle error with a more generic approach
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                error: `Error updating user: ${errorMessage}`
            };
        }
    }
    async initiatePasswordReset(email: string): Promise<{ message?: string, error?: string }> {
        let pool = await mssql.connect(sqlConfig);
        
        try {
            // Check if email exists and user is active
            let user = (await pool.request()
                .input('email', mssql.VarChar, email)
                .query('SELECT * FROM Users WHERE email = @email AND isActive = 1 AND isDelete = 0')).recordset[0];
            
            if (!user) {
                return { error: 'Email not found or account is inactive' };
            }
            
            // Generate a 6-digit reset code
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Initialize email service
            const emailService = new EmailService();
            
            // Store the reset code in the database
            const stored = await emailService.storeResetCode(email, resetCode);
            if (!stored) {
                return { error: 'Failed to store reset code' };
            }
            
            // Send the reset code via email
            const sent = await emailService.sendResetCode(email, resetCode);
            if (!sent) {
                return { error: 'Failed to send reset code' };
            }
            
            return { message: 'Reset code sent to your email' };
        } catch (error) {
            console.error('Error initiating password reset:', error);
            return { error: 'Failed to initiate password reset' };
        }
    }
    async verifyResetCode(email: string, resetCode: string): Promise<{ message?: string, error?: string }> {
        try {
            const emailService = new EmailService();
            const isValid = await emailService.validateResetCode(email, resetCode);
            
            if (!isValid) {
                return { error: 'Invalid or expired reset code' };
            }
            
            return { message: 'Reset code verified successfully' };
        } catch (error) {
            console.error('Error verifying reset code:', error);
            return { error: 'Failed to verify reset code' };
        }
    }
    async resetPassword(email: string, resetCode: string, newPassword: string): Promise<{ message?: string, error?: string }> {
        let pool = await mssql.connect(sqlConfig);
        
        try {
            // First verify the reset code
            const verification = await this.verifyResetCode(email, resetCode);
            if (verification.error) {
                return verification;
            }
            
            // Validate password length
            if (newPassword.length < 6) {
                return { error: 'Password must be at least 6 characters' };
            }
            
            // Hash the new password
            const hashedPassword = bcrypt.hashSync(newPassword, 6);
            
            // Update the password in the database
            const result = await pool.request()
                .input('email', mssql.VarChar, email)
                .input('password', mssql.VarChar, hashedPassword)
                .input('updatedAt', mssql.DateTime, new Date())
                .query('UPDATE Users SET password = @password, updatedAt = @updatedAt, isUpdated = 1 WHERE email = @email');
            
            if (result.rowsAffected[0] === 1) {
                // Delete the used reset code
                const emailService = new EmailService();
                await emailService.deleteResetCode(email);
                
                return { message: 'Password reset successfully' };
            } else {
                return { error: 'Failed to reset password' };
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            return { error: 'Failed to reset password' };
        }
    }
    async uploadProfileImage(user_id: string, imagePath: string): Promise<{ 
        message: string, 
        imageUrl: string,
        oldImagePath?: string 
    }> {
        try {
            let pool = await mssql.connect(sqlConfig);
            
            // First get the current profile image path
            const currentResult = await pool.request()
                .input('user_id', mssql.VarChar, user_id)
                .query('SELECT profile FROM Users WHERE id = @user_id');
            
            const oldImagePath = currentResult.recordset[0]?.profile || null;
    
            // Update with new image path
            const updateResult = await pool.request()
                .input('user_id', mssql.VarChar, user_id)
                .input('profile', mssql.VarChar, imagePath)
                .query('UPDATE Users SET profile = @profile WHERE id = @user_id');
                
            if (updateResult.rowsAffected[0] === 1) {
                return { 
                    message: 'Profile image uploaded successfully',
                    imageUrl: imagePath,
                    oldImagePath
                };
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    }

    // user.service.ts
    async getProfileImagePath(user_id: string): Promise<{ exists: boolean; imagePath: string | null }> {
        try {
            let pool = await mssql.connect(sqlConfig);
            
            const result = await pool.request()
                .input('user_id', mssql.VarChar, user_id)
                .query('SELECT profile FROM Users WHERE id = @user_id');
            
            const imagePath = result.recordset[0]?.profile;
            
            return {
                exists: !!imagePath,
                imagePath: imagePath || null
            };
        } catch (error) {
            console.error('Error getting profile image path:', error);
            throw error;
        }
    }
    
    async updateProfileDetails(user_id: string, profileData: UserProfile): Promise<{ message?: string, error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);
            
            // Prepare the SQL update query
            let query = `
                UPDATE Users SET
                    ${profileData.bio ? 'bio = @bio,' : ''}
                    ${profileData.profession ? 'profession = @profession,' : ''}
                    ${profileData.university ? 'university = @university,' : ''}
                    isUpdated = 1,
                    updatedAt = GETDATE()
                WHERE id = @user_id
            `;
            
            // Remove trailing comma if exists
            query = query.replace(/,\s*WHERE/, ' WHERE');
            
            let request = pool.request()
                .input('user_id', mssql.VarChar, user_id);
                
            if (profileData.bio) request.input('bio', mssql.VarChar, profileData.bio);
            if (profileData.profession) request.input('profession', mssql.VarChar, profileData.profession);
            if (profileData.university) request.input('university', mssql.VarChar, profileData.university);
            
            let result = await request.query(query);
            
            if (result.rowsAffected[0] === 1) {
                return { message: 'Profile details updated successfully' };
            } else {
                return { error: 'User not found or no changes made' };
            }
        } catch (error) {
            console.error('Error updating profile details:', error);
            return { error: 'Failed to update profile details' };
        }
    }
    
    // user.service.ts
    async getProfileDetails(user_id: string): Promise<{ profile?: UserProfile; error?: string }> {
        try {
            let pool = await mssql.connect(sqlConfig);
            
            let result = await pool.request()
                .input('user_id', mssql.VarChar, user_id)
                .query(`
                    SELECT profile, bio, profession, university 
                    FROM Users 
                    WHERE id = @user_id AND isDelete = 0
                `);
                
            if (result.recordset.length === 0) {
                return { error: 'User not found' };
            }
            
            const user = result.recordset[0];
            
            // Explicitly type the profile object to match UserProfile
            const profile: UserProfile = {
                profileImage: user.profile,
                bio: user.bio,
                profession: user.profession,
                university: user.university
            };
            
            return {
                profile
            };
        } catch (error) {
            console.error('Error fetching profile details:', error);
            return { error: 'Failed to fetch profile details' };
        }
    }

    
}