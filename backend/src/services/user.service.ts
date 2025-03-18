import lodash from 'lodash'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcryptjs'

import { sqlConfig } from '../config/sqlConfig';
import { User } from '../interfaces/user.interface';



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
}