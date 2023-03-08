import axios from "axios"

export const signInWithEmailAndPassword = async (username, password) => {
    try {
        const response = await axios({
            url: '/auth/login',
            baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
            method: "post",
            data: { username, password },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
        if (response.status !== 201) {
            throw new Error(response.data);
        }
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function saveAccessToken(accessToken) {
    try {
        const response = await axios({
            url: '/auth/fbToken',
            baseURL: process.env.SERVER_URL,
            method: "post",
            data: { accessToken },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
        if (response.status !== 201) {
            throw new Error(response.data);
        }
        return response
    } catch (error) {
        console.error(error)
    }
}