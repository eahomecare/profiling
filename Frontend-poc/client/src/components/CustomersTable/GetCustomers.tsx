import axios from "axios"
import { useAuthContext } from "../../contexts/AuthContext"

export const getCustomers = async (token: any) => {
    const keywordCount = 10
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_BASE_URL}customers/`
    const { data } = await axios.get(url, config)

    data.customer_details.forEach((customer: any) => {
        customer.profile_completion = (customer.keys.length / keywordCount) * 100 > 100 ? 100 : (customer.keys.length / keywordCount) * 100
    })

    console.log('data:', data)
    return data
}