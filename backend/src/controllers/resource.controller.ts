import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';
import path from 'path'
import { resourceSchema } from '../validators/resource.validator';

let service = new ResourceService();

export class ResourceController {
    async addResource(req: Request, res: Response) {
        try {
            console.log('Request headers:', req.headers); // Log request headers
            console.log('Request body:', req.body); // Log request body
            console.log('Request files:', req.files); // Log request files
    
            const { error } = resourceSchema.validate(req.body);
            if (error) {
                console.error(`Validation error: ${error.message}`); // Log validation error
                return res.status(400).json({ error: error.message });
            }
    
            const { title, description, quantity } = req.body;
            const file = req.files?.file;
            const image = req.files?.image;
    
            if (!file || !image) {
                console.error('File or image is missing'); // Log missing file or image
                return res.status(400).json({ error: "File and image are required" });
            }
    
            // Create a temporary resource object without filePath and imagePath
            const resource = {
                title,
                description,
                quantity,
                filePath: '', // Placeholder, will be updated after file upload
                imagePath: '', // Placeholder, will be updated after image upload
            };
    
            // Pass the resource object and files to the service
            let result = await service.addResource(resource, file, image);
            return res.status(201).json(result);
        } catch (error) {
            console.error(`Error adding resource: ${error}`); // Log general error
            return res.status(500).json({ error: "Failed to add resource" });
        }
    }

    async editResource(req: Request, res: Response) {
        try {
            const { resource_id } = req.params;
            const { title, description, quantity } = req.body;
            const file = req.files?.file;
            const image = req.files?.image;

            let result = await service.editResource(resource_id, { title, description, quantity }, file, image);
            return res.status(200).json(result);
        } catch (error) {
            console.error(`Error editing resource: ${error}`);
            return res.status(500).json({ error: "Failed to edit resource" });
        }
    }

    async deleteResource(req: Request, res: Response) {
        try {
            const { resource_id } = req.params;
            let result = await service.softDeleteResource(resource_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    async borrowBook(req: Request, res: Response) {
        try {
            const { user_id, resource_id, return_date } = req.body;

            const borrowedBook = {
                user_id,
                resource_id,
                borrowed_date: new Date(),
                return_date: new Date(return_date),
            };

            let result = await service.borrowBook(borrowedBook);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    async getBorrowedBooks(req: Request, res: Response) {
        try {
            let result = await service.getBorrowedBooks();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    async getOverdueBooks(req: Request, res: Response) {
        try {
            let result = await service.getOverdueBooks();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
    async viewResource(req: Request, res: Response) {
        try {
            const { resource_id } = req.params;

            // Fetch the file path from the database
            const filePath = await service.getResourceFilePath(resource_id);

            if (!filePath) {
                return res.status(404).json({ error: "Resource not found or has been deleted" });
            }

            // Serve the file
            res.sendFile(path.resolve(filePath));
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch resource" });
        }
    }
    async getAllResources(req: Request, res: Response) {
        try {
            // Fetch all resources from the service
            let resources = await service.getAllResources();
    
            // Check if resources were found
            if (resources.length > 0) {
                return res.status(200).json(resources);
            } else {
                return res.status(404).json({ message: "No resources found" });
            }
        } catch (error) {
            console.error(`Error in getAllResources controller: ${error}`);
            return res.status(500).json({ error: "Failed to fetch resources" });
        }
    }
    async getResourceById(req: Request, res: Response) {
        try {
            const { resource_id } = req.params;
    
            // Fetch the resource by ID from the service
            let resource = await service.getResourceById(resource_id);
    
            // Check if the resource was found
            if (resource) {
                return res.status(200).json(resource);
            } else {
                return res.status(404).json({ error: "Resource not found or has been deleted" });
            }
        } catch (error) {
            console.error(`Error in getResourceById controller: ${error}`);
            return res.status(500).json({ error: "Failed to fetch resource" });
        }
    }
    async returnBook(req: Request, res: Response) {
        try {
            const { resource_id, user_id } = req.body;
    
            // Call the service to return the book
            let result = await service.returnBook(resource_id, user_id);
    
            if (result.error) {
                return res.status(400).json(result);
            }
    
            return res.status(200).json(result);
        } catch (error) {
            console.error(`Error in returnBook controller: ${error}`);
            return res.status(500).json({ error: "Failed to return book" });
        }
    }
    async getBooksBorrowedByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
    
            // Fetch books borrowed by the user from the service
            let result = await service.getBooksBorrowedByUser(user_id);
    
            // Check if the result is an error object
            if (result && 'error' in result) {
                return res.status(500).json(result); // Return the error response
            }
    
            // Check if books were found
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "No books borrowed by this user" });
            }
        } catch (error) {
            console.error(`Error in getBooksBorrowedByUser controller: ${error}`);
            return res.status(500).json({ error: "Failed to fetch books borrowed by user" });
        }
    }

    async getOverdueBooksByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
    
            // Fetch overdue books for the user from the service
            let result = await service.getOverdueBooksByUser(user_id);
    
            // Check if overdue books were found
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "No overdue books found for this user" });
            }
        } catch (error) {
            console.error(`Error in getOverdueBooksByUser controller: ${error}`);
    
            // Check if the error is an instance of the Error class
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
}