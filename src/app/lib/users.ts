import axios from "axios"

export const users = {
    fetchAllUsers: async (currentUserId?: string) => {
        try {
            return (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/all?currentUserId=${currentUserId}`)).data
        } catch (error: any) {
            throw new Error(error.messages || 'Something went wrong.')
        }
    }
}