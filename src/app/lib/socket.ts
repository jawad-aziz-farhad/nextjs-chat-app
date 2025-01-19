import io, { Socket } from "socket.io-client";
import { API_URL } from "../constants";

let socket: typeof Socket | null = null;

export const initializeSocket = (token: string) => {
    if(socket) socket.disconnect();
    socket = io(`${API_URL}`, {
        auth: {
            token: `Bearer ${token}`
        }
    });
    

    return socket;
}

export const getSocket = () => socket;

