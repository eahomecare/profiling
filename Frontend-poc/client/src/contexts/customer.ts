import axios from "axios"
import { useAuthContext } from "./AuthContext"

export const getCustomerById = async (customerId: string) => {
    const { token } = useAuthContext()
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_BASE_URL}customers/${customerId}`
    const { data } = await axios.get(url, config)
    console.log('Customer data fetched', data)
    return data
}