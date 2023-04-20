import { Button } from '@mantine/core'
import axios, { AxiosError, AxiosResponse, AxiosResponseTransformer } from 'axios'
import { useAuthContext } from '../../contexts/AuthContext'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'

const Submit = ({ keywordsSelected, selectedCustomer, setSelectedCustomer }: any) => {
    const { token } = useAuthContext()
    // selectedCustomer.keys = keywordsSelected
    // useEffect(() => {
    //     setSelectedCustomer()((cust: any) => { return { ...cust, keys: keywordsSelected } })
    // }, [])
    const createPayload = () => {
        const payload = {
            ...selectedCustomer, keys: keywordsSelected
            // mobile,
            // keys: keys,
            // source: 2,
            // // test:'fake'
        }
        return payload
    }

    const errorNotification = (error: AxiosError) => notifications.show({
        id: 'submit-error',
        withCloseButton: true,
        onClose: () => console.log('unmounted'),
        onOpen: () => console.log('mounted'),
        autoClose: 5000,
        title: error.message,
        message: 'There seems to be a problem with the network',
        color: 'red',
        icon: <IconX />,
        className: 'my-notification-class',
        // style: { backgroundColor: 'red' },
        // sx: { backgroundColor: 'red' },
        loading: false,
    });

    const successNotification = (res: any) => {
        notifications.show({
            id: 'submit-success',
            withCloseButton: true,
            onClose: () => console.log('unmounted'),
            onOpen: () => console.log('mounted'),
            autoClose: 5000,
            title: 'Success',
            message: 'Keywords have been stored successfully',
            color: 'teal',
            icon: <IconCheck />,
            className: 'my-notification-class',
            // style: { backgroundColor: 'red' },
            // sx: { backgroundColor: 'red' },
            loading: false,
        });
    }

    const handleSubmit = async () => {
        const url = `http://localhost:3000/customers/${selectedCustomer.id}`
        const payload = createPayload()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        console.log('token used during submission:', token)
        console.log('keywords selected', keywordsSelected)
        console.log('payload', payload)
        console.log('config', config)
        await axios.patch(url, payload, config)
            .then(console.log)
            .then(successNotification)
            .catch(errorNotification)
            .catch(console.log)

        const customerUrl = `http://localhost:3000/customers/${selectedCustomer.id}`
        const { data } = await axios.get(url, config)
        setSelectedCustomer(data.customer_details)
    }
    return (
        <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={handleSubmit}>
            Submit Keywords
        </Button>
    )
}

export default Submit