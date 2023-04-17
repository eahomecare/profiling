import { Container, Flex, Space, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import InterestComponent from './InterestComponent'
import { getCustomerById } from '../../contexts/customer'

const Interests = ({ selectedCustomer }: any) => {
    // Set loading state and fetch the new customer data
    const [interests, setInterests] = useState({ ...selectedCustomer.profiling })
    console.log('garbage in selectedCustomer', interests.garbage)
    const garbage = interests.garbage
    delete interests.personal_details
    delete interests.garbage
    console.log('garbage', garbage)

    const interestKeys = Object.keys(interests)
    let grouping = interestKeys.map((key) => {
        return { [key]: Object.keys(interests[key]) }
    })
    grouping = [...grouping, { unknown: garbage }]

    console.log('Grouping', grouping)

    const categories = grouping.map((obj) => {
        const title = Object.keys(obj)[0]
        const tags = obj[title]
        return (<>
            <InterestComponent title={title} tags={tags} />
            <Space h={'md'} />
        </>)
    })

    return (
        <>
            <Container>
                <Text fw={700}>Interest Details</Text>
                {categories}
            </Container>
        </>
    )
}

export default Interests