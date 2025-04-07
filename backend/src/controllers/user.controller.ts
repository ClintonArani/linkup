import { Request, Response } from 'express'
import { userService } from '../services/user.service'
import { userSchema } from '../validators/user.validator'
import { handleFileUpload } from '../utils/fileUpload.util';
import { UploadedFile } from 'express-fileupload';

let service = new userService()

export class userController {
    async createUser (req: Request, res: Response) {
        try {
            console.log('Request Body:', req.body);
            let {firstName, lastName, phoneNumber, email, password} = req.body;
            let {error} = userSchema.validate(req.body);

            if(error) {
                return res.status(401).json({
                    error: error.message
                });
            }
            let result = await service.registerUser(req.body);

            return res.status(201).json(result);
        } catch (error) {
            return res.json({
                error
            });
        }
    }

    async fetchAll(req: Request, res: Response) {
        try {
            let result = await service.fetchAllUsers()

            return res.status(201).json(result)
        } catch (error) {
            return res.json({
                error
            })
        }
    }

    async fetchSingleUser(req:Request, res: Response) {
        try {
            let {user_id} = req.params
            let response = await service.fetchSingleUser(user_id)
            return res.json(response)
        } catch (error) {
            return res.json ({
                error
            })
        }
    }

    async switchRoles(req: Request, res: Response): Promise<Response> {
        try {
            const { user_id } = req.body;

            // Ensure user_id is provided
            if (!user_id) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const response = await service.switchRoles(user_id);

            // Handle the response from the service
            if (response.error) {
                return res.status(500).json({ error: response.error });
            }

            return res.status(200).json(response);
        } catch (error) {
            // Handle unexpected errors
            if (error instanceof Error) {
                console.error("Error in switchRoles controller:", error.message);
                return res.status(500).json({ error: `Error in switchRoles controller: ${error.message}` });
            } else {
                console.error("Unexpected error in switchRoles controller:", error);
                return res.status(500).json({ error: "Unexpected error occurred while switching roles." });
            }
        }
    }

    
    async updateUser(req: Request, res: Response) {
        try {
            let { user_id } = req.params;
            let updatedUser = req.body;
    
            let result = await service.updateUser(user_id, updatedUser);
    
            if (result.error) {
                return res.status(400).json(result);
            }
    
            return res.status(200).json(result);
        } catch (error) {
            // Handle errors here with a more generic approach
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            return res.status(500).json({
                error: `Internal server error: ${errorMessage}`
            });
        }
    }
    async deleteUser(req: Request, res: Response) {
        try {
            let { user_id } = req.params;
    
            // Call the deleteUser method from the service
            let result = await service.deleteUser(user_id);
    
            if (result.error) {
                return res.status(404).json(result); // User not found or already deleted
            }
    
            return res.status(200).json(result); // User deleted successfully
        } catch (error) {
            // Handle unexpected errors
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            return res.status(500).json({
                error: `Internal server error: ${errorMessage}`
            });
        }
    }
    async initiatePasswordReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            
            const result = await service.initiatePasswordReset(email);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in initiatePasswordReset:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async verifyResetCode(req: Request, res: Response) {
        try {
            const { email, resetCode } = req.body;
            
            if (!email || !resetCode) {
                return res.status(400).json({ error: 'Email and reset code are required' });
            }
            
            const result = await service.verifyResetCode(email, resetCode);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in verifyResetCode:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            const { email, resetCode, newPassword } = req.body;
            
            if (!email || !resetCode || !newPassword) {
                return res.status(400).json({ error: 'Email, reset code and new password are required' });
            }
            
            const result = await service.resetPassword(email, resetCode, newPassword);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async uploadProfileImage(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            const profileImage = req.files?.profileImage as UploadedFile;
    
            if (!profileImage) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
    
            // Simple file type validation
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(profileImage.mimetype)) {
                return res.status(400).json({ error: 'Only JPEG and PNG images are allowed' });
            }
    
            // First get the current image path from database
            const currentImageResult = await service.getProfileImagePath(user_id);
            const oldImagePath = currentImageResult.imagePath || undefined;
    
            // Handle the file upload (will delete old file if exists)
            const imagePath = await handleFileUpload(profileImage, oldImagePath);
    
            // Update database with the new image path
            const result = await service.uploadProfileImage(user_id, imagePath);
    
            return res.status(200).json({
                message: 'Profile image uploaded successfully',
                imageUrl: imagePath
            });
        } catch (error: unknown) {
            console.error('Upload error:', error);
            
            if (error instanceof Error) {
                if (error.message === 'File size too large') {
                    return res.status(413).json({ error: 'File exceeds 50MB limit' });
                }
                return res.status(500).json({ 
                    error: 'Internal server error',
                    details: error.message 
                });
            }
            
            return res.status(500).json({ 
                error: 'Internal server error',
                details: 'An unknown error occurred' 
            });
        }
    }

    async updateProfileDetails(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            const profileData = req.body;
            
            const result = await service.updateProfileDetails(user_id, profileData);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in updateProfileDetails:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getProfileDetails(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            
            const result = await service.getProfileDetails(user_id);
            
            if (result.error) {
                return res.status(404).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getProfileDetails:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}