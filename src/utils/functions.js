import axios from 'axios'
export const axiosFetch = async (url, method, data = null) => {
    try {
        const response = await axios({
            url: url,
            baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
            method: method,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            },
        })
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        return response.data
    } catch (error) {
        console.error(error)
    }
}