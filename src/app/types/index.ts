export interface User {
    _id?: string;
    email: string;
    username?: string;
    password?: string;
    createdAt?: Date
    isOnline?: boolean;
}

export interface Message {
    _id?: string;
    content: string;
    recipient?: User;
    room: string;
    sender: User;
    isMessageRead: boolean;
    readAt?: Date;
    socketId?: string;
    createdAt?: Date;
}