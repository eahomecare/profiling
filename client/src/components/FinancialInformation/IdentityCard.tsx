import React, { useState, useEffect } from 'react';
import { ActionIcon, Box, Flex, Text, TextInput } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface IdentityCardProps {
    title: string;
    subTitle: string;
    detail: string;
    index: number;
    onUpdateDetail: (index: number, newValue: string) => void;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ title, subTitle, detail, index, onUpdateDetail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(detail);

    useEffect(() => {
        setEditedValue(detail);
    }, [detail]);

    const handleSave = () => {
        onUpdateDetail(index, editedValue);
        setIsEditing(false);
    };

    const handleDiscard = () => {
        setEditedValue(detail);
        setIsEditing(false);
    };

    return (
        <>
            <Box>
                <Flex justify={'space-between'} p={20}>
                    <Box>
                        <Text>{title}</Text>
                        <Text>{subTitle}</Text>
                        {isEditing ? (
                            <TextInput
                                value={editedValue}
                                onChange={(event) => setEditedValue(event.currentTarget.value)}
                            />
                        ) : (
                            <Text>{detail}</Text>
                        )}
                    </Box>
                    <Box>
                        {isEditing ? (
                            <>
                                <ActionIcon onClick={handleSave} color="green" variant="subtle" size={'sm'}>
                                    <IconCheck color="#4E70EA" />
                                </ActionIcon>
                                <ActionIcon onClick={handleDiscard} color="red" variant="subtle" size={'sm'}>
                                    <IconX color="#F34336" />
                                </ActionIcon>
                            </>
                        ) : (
                            <ActionIcon onClick={() => setIsEditing(true)} color="blue" variant="subtle" size={'sm'}>
                                <IconEdit color="#4E70EA" />
                            </ActionIcon>
                        )}
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default IdentityCard;