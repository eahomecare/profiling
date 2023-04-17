import { Badge, Card, Flex, Space, Text } from '@mantine/core'
import React from 'react'

const InterestComponent = ({ title, tags }: any) => {
    const tagComponents = (title: string) => (
        tags.map((tag: string) => (
            <>
                <Badge size="sm" variant="outline">
                    {tag.split('-')[1]}
                </Badge>
                <Space w={'md'} />
            </>
        ))
    )
    return (
        <>
            <Text pb={5} fz={'sm'} c='dimmed'>{title.split('_').join(' ')}{` (${tags?.length})`}</Text>
            <Flex>
                {tagComponents(title)}
            </Flex>
        </>
    )
}

export default InterestComponent