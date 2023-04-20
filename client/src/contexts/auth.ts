import axios from "axios"

export const getToken = async () => {
    const url = import.meta.env.VITE_API_BASE_URL + 'auth/signin'
    const email = import.meta.env.VITE_API_CREDENTIALS_EMAIL
    const password = import.meta.env.VITE_API_CREDENTIALS_PASSWORD
    const { data } = await axios.post(url, { email, password })
    console.log(data)
    return data
}