import { ActionIcon, Badge, Card, Flex, Space, Text, rem } from '@mantine/core'
import React, { useState } from 'react'
import AddMore from './AddMore'
import { IconX } from '@tabler/icons-react'

const InterestComponent = ({ title, tags, setTags, selectedCustomer, setSelectedCustomer }: any) => {
    console.log('Tags are ', tags)
    console.log('title in interest component is', title)
    const [badgeClicked, setBadgeClicked] = useState<string>('')
    const removeButton = (
        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
            <IconX size={rem(10)} />
        </ActionIcon>
    );
    const tagComponents = (title: string) => (
        tags.map((tag: string) => (
            <>
                <Badge size="sm" variant="outline" onClick={() => setBadgeClicked(tag)} rightSection={removeButton}>
                    <Text>
                        {tag.split('-')[1] || tag}
                    </Text>
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
                <AddMore tags={tags} setTags={setTags} badgeClicked={badgeClicked} title={title} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
            </Flex>
        </>
    )
}

export default InterestComponent