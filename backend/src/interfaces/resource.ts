export interface Resource {
    id?: string;
    title: string;
    description: string;
    filePath?: string;
    imagePath?: string;
    quantity: number; // Add this field
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BorrowedBook {
    id?: string;
    user_id: string;
    resource_id: string;
    borrowed_date: Date;
    return_date: Date;
    is_returned?: boolean;
}