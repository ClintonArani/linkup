import mssql from 'mssql';
import { v4 } from 'uuid';
import { sqlConfig } from '../config/sqlConfig';
import { BorrowedBook, Resource } from '../interfaces/resource';

export class ResourceService {
    async addResource(resource: Resource) {
        let pool = await mssql.connect(sqlConfig);
        let resource_id = v4();
        let createdAt = new Date();

        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, resource_id)
                .input("title", mssql.VarChar, resource.title)
                .input("description", mssql.Text, resource.description)
                .input("quantity", mssql.Int, resource.quantity)
                .input("createdAt", mssql.DateTime, createdAt)
                .execute("addResource")).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: "Resource added successfully"
                };
            } else {
                return {
                    error: "Unable to add resource"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async editResource(resource_id: string, updatedResource: Partial<Resource>) {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            try {
                let result = (await pool.request()
                    .input("id", mssql.VarChar, resource_id)
                    .input("title", mssql.VarChar, updatedResource.title)
                    .input("description", mssql.Text, updatedResource.description)
                    .input("quantity", mssql.Int, updatedResource.quantity)
                    .input("updatedAt", mssql.DateTime, new Date())
                    .execute("updateResource")).rowsAffected;

                if (result[0] == 1) {
                    return {
                        message: "Resource updated successfully"
                    };
                } else {
                    return {
                        error: "Unable to update resource"
                    };
                }
            } catch (error) {
                console.error(`Error executing stored procedure: ${error}`);
                throw new Error("Failed to update resource");
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async softDeleteResource(resource_id: string) {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, resource_id)
                .query("UPDATE resources SET isDeleted = 1 WHERE id = @id")).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: "Resource deleted successfully"
                };
            } else {
                return {
                    error: "Unable to delete resource"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async borrowBook(borrowedBook: BorrowedBook) {
        let pool = await mssql.connect(sqlConfig);
        let borrow_id = v4();

        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, borrow_id)
                .input("user_id", mssql.VarChar, borrowedBook.user_id)
                .input("resource_id", mssql.VarChar, borrowedBook.resource_id)
                .input("borrowed_date", mssql.Date, borrowedBook.borrowed_date)
                .input("return_date", mssql.Date, borrowedBook.return_date)
                .execute("borrowBook")).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: "Book borrowed successfully"
                };
            } else {
                return {
                    error: "Unable to borrow book"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async getBorrowedBooks() {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .query(`
                    SELECT 
                        bb.id AS borrow_id, 
                        u.firstName, 
                        u.lastName, 
                        r.title, 
                        bb.borrowed_date, 
                        bb.return_date, 
                        bb.is_returned 
                    FROM borrowed_books bb
                    JOIN users u ON bb.user_id = u.id
                    JOIN resources r ON bb.resource_id = r.id
                `)).recordset;

            return result;
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async getOverdueBooks() {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            let result = (await pool.request()
                .query(`
                    SELECT 
                        bb.id AS borrow_id, 
                        u.firstName, 
                        u.lastName, 
                        r.title, 
                        bb.borrowed_date, 
                        bb.return_date 
                    FROM borrowed_books bb
                    JOIN users u ON bb.user_id = u.id
                    JOIN resources r ON bb.resource_id = r.id
                    WHERE bb.return_date < GETDATE() AND bb.is_returned = 0
                `)).recordset;

            return result;
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }
    async getResourceFilePath(resource_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        if (pool.connected) {
            let result = (await pool.request()
                .input("resource_id", mssql.VarChar, resource_id)
                .query("SELECT filePath FROM resources WHERE id = @resource_id AND isDeleted = 0")).recordset[0];
    
            if (result) {
                return result.filePath;
            } else {
                return null;
            }
        } else {
            throw new Error("Unable to establish connection");
        }
    }
    async getAllResources() {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            if (pool.connected) {
                // Execute the stored procedure
                let result = (await pool.request()
                    .execute("getAllResources")).recordset;
    
                // Return the list of resources
                return result;
            } else {
                throw new Error("Unable to establish database connection");
            }
        } catch (error) {
            console.error(`Error fetching all resources: ${error}`);
            throw new Error("Failed to fetch resources");
        }
    }
    async getResourceById(resource_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        try {
            if (pool.connected) {
                // Execute the stored procedure
                let result = (await pool.request()
                    .input("id", mssql.VarChar, resource_id)
                    .execute("getResourceById")).recordset[0];
    
                // Check if the resource was found
                if (result) {
                    return result;
                } else {
                    return null; // Resource not found or is deleted
                }
            } else {
                throw new Error("Unable to establish database connection");
            }
        } catch (error) {
            console.error(`Error fetching resource by ID: ${error}`);
            throw new Error("Failed to fetch resource");
        }
    }
    async returnBook(resource_id: string, user_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        if (pool.connected) {
            try {
                // Start a transaction
                const transaction = new mssql.Transaction(pool);
                await transaction.begin();
    
                try {
                    // Remove the book from the borrowed_books table
                    await transaction.request()
                        .input("resource_id", mssql.VarChar, resource_id)
                        .input("user_id", mssql.VarChar, user_id)
                        .query("DELETE FROM borrowed_books WHERE resource_id = @resource_id AND user_id = @user_id");
    
                    // Update the quantity in the resources table
                    await transaction.request()
                        .input("resource_id", mssql.VarChar, resource_id)
                        .query("UPDATE resources SET quantity = quantity + 1 WHERE id = @resource_id");
    
                    // Commit the transaction
                    await transaction.commit();
    
                    return {
                        message: "Book returned successfully"
                    };
                } catch (error) {
                    // Rollback the transaction in case of error
                    await transaction.rollback();
                    console.error(`Error returning book: ${error}`);
                    throw new Error("Failed to return book");
                }
            } catch (error) {
                console.error(`Error returning book: ${error}`);
                throw new Error("Failed to return book");
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }
    
    async getBooksBorrowedByUser(user_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        if (pool.connected) {
            try {
                let result = (await pool.request()
                    .input("user_id", mssql.VarChar, user_id)
                    .query(`
                        SELECT 
                            r.id AS resource_id, 
                            r.title, 
                            r.description, 
                            bb.borrowed_date, 
                            bb.return_date 
                        FROM borrowed_books bb
                        JOIN resources r ON bb.resource_id = r.id
                        WHERE bb.user_id = @user_id AND bb.is_returned = 0
                    `)).recordset;
    
                return result; // Return the recordset (array of results)
            } catch (error) {
                console.error(`Error fetching books borrowed by user: ${error}`);
                throw new Error("Failed to fetch books borrowed by user");
            }
        } else {
            throw new Error("Unable to establish connection");
        }
    }
    async getOverdueBooksByUser(user_id: string) {
        let pool = await mssql.connect(sqlConfig);
    
        if (pool.connected) {
            try {
                let result = (await pool.request()
                    .input("user_id", mssql.VarChar, user_id)
                    .query(`
                        SELECT 
                            r.id AS resource_id, 
                            r.title, 
                            r.description, 
                            bb.borrowed_date, 
                            bb.return_date 
                        FROM borrowed_books bb
                        JOIN resources r ON bb.resource_id = r.id
                        WHERE bb.user_id = @user_id 
                          AND bb.return_date < GETDATE() 
                          AND bb.is_returned = 0
                    `)).recordset;
    
                return result; // Return the recordset (array of results)
            } catch (error) {
                console.error(`Error fetching overdue books for user: ${error}`);
                throw new Error("Failed to fetch overdue books for user");
            }
        } else {
            throw new Error("Unable to establish connection");
        }
    }
}