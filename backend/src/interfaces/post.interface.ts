export interface Post {
    id: string;
    user_id: string;
    content: string;
    image_url?: string;
    created_at: Date;
    updated_at?: Date;
}

export interface PostWithDetails extends Post {
    firstName: string;
    lastName: string;
    user_profile?: string;
    like_count: number;
    comments: PostComment[];
}

export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: Date;
    updated_at?: Date;
    firstName?: string;
    lastName?: string;
    user_profile?: string;
}

export interface PostLike {
    id: string;
    post_id: string;
    user_id: string;
    created_at: Date;
}

export interface CreatePostInput {
    content: string;
    image?: any; // For file upload
}

export interface UpdatePostInput {
    content?: string;
    image?: any; // For file upload
}

export interface AddCommentInput {
    content: string;
}