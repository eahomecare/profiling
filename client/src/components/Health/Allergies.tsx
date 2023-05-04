import React, { useState } from 'react';
import { ActionIcon, Badge, Flex, Space, Text, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import AddMore from './AddMore';

const initialTags = ['Food', 'Pet', 'Mold', 'Pollen', 'Insect'];

const Allergies = () => {
    const [tags, setTags] = useState<string[]>(initialTags);

    const handleRemoveClick = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const tagComponents = () =>
        tags.map((tag: string) => (
            <>
                <Badge
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveClick(tag)}
                    rightSection={<RemoveButton />}
                >
                    <Text>{tag.split('-')[1] || tag}</Text>
                </Badge>
                <Space w={'md'} />
            </>
        ));

    const RemoveButton = () => (
        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
            <IconX size={rem(10)} />
        </ActionIcon>
    );

    return (
        <>
            <Text fz={'sm'} c="dimmed">
                Allergies
            </Text>
            <Flex>
                {tagComponents()}
                <AddMore tags={tags} setTags={setTags} />
            </Flex>
        </>
    );
};

export default Allergies;