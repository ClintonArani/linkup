// interfaces/user.interface.ts
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
    isDelete: boolean;
    isUpdated: boolean;
}
 
  
export interface login_details{
    email:string,
    password:string
}

export interface token_datails{
    id:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}

export interface Connection {
    id: string;
    senderId: string;
    receiverId: string;
    status: string; // 'pending', 'accepted', 'rejected'
    createdAt: string;
    updatedAt?: string;
}

export interface ConnectionRequest {
    senderId: string;
    receiverId: string;
}

export interface ConnectionStatusUpdate {
    connectionId: string;
    status: string; // 'accepted', 'rejected'
}