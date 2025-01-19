import axios from "axios";

export const messages = {
    
    fetchMessages: async (sender: string | undefined, recipient: string | undefined, token: string | null) => {
        const messages = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat?recipient=${recipient}&sender=${sender}`, { headers: { Authorization: `Bearer ${token}`}})
        return messages;
    }
}