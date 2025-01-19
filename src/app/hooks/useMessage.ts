import { useCallback, useEffect, useState } from "react"
import { messages } from "../lib/messages"
import { useAuthState } from "../store/useAuthState"
import { Message, User } from "../types"

export const useMessage = () => {

    const { user: sender, token } = useAuthState();
    const { fetchMessages } = messages;
    const [ recipient, setRecipient] = useState<User>({} as User);
    const [selectedUserMessages, setSelectedUserMessages] = useState<Message[]>([]);
    const fetchAllMessages = useCallback(async() => {
        try {
           const response = await fetchMessages(sender?._id, recipient?._id, token)
           setSelectedUserMessages((await response.data));  
        } catch (error) {
            
        } 
    }, [recipient])

    useEffect(() => {
        if(recipient) {
            fetchAllMessages()
        }
    }, [recipient])

    return { selectedUserMessages, setSelectedUserMessages, recipient, setRecipient}
}