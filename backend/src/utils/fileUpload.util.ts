// utils/fileUpload.util.ts
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { v4 } from 'uuid';

export const handleFileUpload = async (
    file: UploadedFile, 
    oldFilePath?: string
): Promise<string> => {
    try {
        const uploadDir = path.join(__dirname, '../../uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Delete old file if it exists
        if (oldFilePath) {
            const fullOldPath = path.join(__dirname, '../../', oldFilePath);
            if (fs.existsSync(fullOldPath)) {
                fs.unlinkSync(fullOldPath);
            }
        }

        // Generate unique filename
        const fileExt = path.extname(file.name);
        const fileName = `${v4()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // Move file to uploads folder
        await file.mv(filePath);

        // Return the relative path
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error('File upload failed');
    }
};