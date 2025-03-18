// interfaces/attachment.interface.ts

export interface Attachment {
    id: string;
    title: string;
    description: string;
    company_name: string;
    application_link: string;
    created_by: string;
    created_at: string;
    updated_at?: string;
}

export interface UserAttachment {
    id: string;
    user_id: string;
    attachment_id: string;
    applied_at: string;
}