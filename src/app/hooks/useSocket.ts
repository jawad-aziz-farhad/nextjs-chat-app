import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';
import { useAuthState } from '../store/useAuthState';

export const useSocket = () => {
    const { token } = useAuthState();
    const [socket, setSocket] = useState<typeof Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'htpp://localhost:3000', {
            reconnection: true,
            reconnectionAttempts: maxReconnectAttempts,
            reconnectionDelay: 1000,
            auth: {
                token: `Bearer ${token}`
            }
        });

        const onConnect = () => {
            setIsConnected(true);
            setIsReconnecting(false);
            reconnectAttempts.current = 0;
            toast.success('Connected to chat server.')
        }

        const onDisconnect = () => {
            setIsConnected(false);
            toast.error('Disconnected from chat server.');
        }

        const onReconnectAttempt = () => {
            setIsReconnecting(true);
            reconnectAttempts.current += 1;
            toast.loading(`Reconnecting... Attempt ${reconnectAttempts.current/maxReconnectAttempts}`)
        }

        const onReconnectFailed = () => {
            setIsReconnecting(false);
            toast.error('Failed to reconnect. Please refresh the page.')
        }

        socketInstance.on('connect', onConnect)
        socketInstance.on('disconnect', onDisconnect)
        socketInstance.on('reconnect_attempt', onReconnectAttempt)
        socketInstance.on('reconnect_failed', onReconnectFailed)

        setSocket(socketInstance);

        return () => {
            socketInstance.off('connect', onConnect)
            socketInstance.off('disconnect', onDisconnect)
            socketInstance.off('reconnect_attempt', onReconnectAttempt)
            socketInstance.off('reconnect_failed', onReconnectFailed)
            socketInstance.disconnect();
        }
    }, [token])

    return { socket, isConnected, isReconnecting }
}
