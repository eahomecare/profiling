import { Container, Flex, Space, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import InterestComponent from './InterestComponent'
import { getCustomerById } from '../../contexts/customer'

const Interests = ({ selectedCustomer, setSelectedCustomer }: any) => {
    const [interests, setInterests] = useState({ ...selectedCustomer.profiling })
    console.log('selectedCustomer in Interests', selectedCustomer)
    console.log('garbage in selectedCustomer', interests.garbage)
    const garbage = interests.garbage
    // delete interests.personal_details
    // delete interests.garbage
    console.log('garbage', garbage)

    const interestKeys = Object.keys(interests)
    let grouping = interestKeys
        .filter((key: string) => (key != 'garbage'))
        .filter((key: string) => (key != 'personal_details'))
        .map((key: string) => {
            return { [key]: Object.keys(interests[key]) }
        })
    grouping = [...grouping, { unknown: garbage }]

    console.log('Grouping', grouping)

    const categories = grouping.map((obj) => {
        const [tags, setTags] = useState<string[]>([])
        const title = Object.keys(obj)[0]
        // const tags = obj[title]
        useEffect(() => {
            setTags(obj[title])
        }, [])
        console.log('tags created are', tags)
        return (<>
            <InterestComponent title={title} tags={tags} setTags={setTags} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
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