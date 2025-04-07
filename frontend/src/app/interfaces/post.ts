export interface User {
    id: string;
    firstName: string;
    lastName: string;
    profile?: string;
  }
  
  export interface Post {
    id: string;
    user_id: string;
    user?: User;
    content: string;
    image_url?: string;
    createdAt: Date;
    like_count?: number;
    comments?: Comment[];
    showCommentSection?: boolean;
    newComment?: string;
  }
  
  export interface Comment {
    id: string;
    user_id: string;
    user?: User;
    content: string;
    createdAt: Date;
  }
  
  export interface ApiResponse<T> {
    success?: boolean;
    error?: string;
    post?: T;
    posts?: T[];
    comments?: Comment[];
    comment?: Comment;
  }