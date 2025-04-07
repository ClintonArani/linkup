export interface Forum {
    id?: string;
    title: string;
    description: string;
    icon_url?: string;
    created_by: string;
    created_at?: Date;
    updated_at?: Date;
    is_deleted?: boolean;
}

export interface ForumMember {
    id?: string;
    forum_id: string;
    user_id: string;
    joined_at?: Date;
}

export interface ForumMessage {
    id?: string;
    forum_id: string;
    sender_id: string;
    message: string;
    file_url?: string;
    file_name?: string;
    sent_at?: Date;
}