export interface Forum {
    id: string;
    title: string;
    description: string;
    iconUrl?: string;
    createdBy: string;
    createdAt: string;
}

export interface ForumMember {
    id: string;
    forumId: string;
    userId: string;
    joinedAt: string;
}

export interface ForumMessage {
    id: string;
    forumId: string;
    senderId: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    sentAt: string;
}