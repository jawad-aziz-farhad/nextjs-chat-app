import axios from 'axios';
import { API_URL, ROUTE_SIGN_IN } from "../constants";
import { User } from "../types";

export const auth = {
    signIn: async (loginData: User) => {
        try {
        const response = await axios.post(`${API_URL}${ROUTE_SIGN_IN}`, {...loginData});
        return response.data;
        } catch(error) {
            console.error('Error in Sign In', error);
        }
    },
    signUp: async (signUpData: User) => {
        const response = await axios.post(`${API_URL}/${ROUTE_SIGN_IN}`, {...signUpData});
        return response.data;
    }

}