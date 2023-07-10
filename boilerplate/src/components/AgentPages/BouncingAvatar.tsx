// @ts-nocheck
import React, { useEffect, useState } from 'react';
import assets from './assets';
import './BouncingAvatar.css'
import { Center, Stack, Text } from '@mantine/core';

interface BouncingAvatarProps {
    shouldBounce: boolean;
    onClick: () => void;
}

const BouncingAvatar: React.FC<BouncingAvatarProps> = ({ shouldBounce, onClick }) => {
    const [animation, setAnimation] = useState('');

    useEffect(() => {
        if (shouldBounce) {
            setAnimation('bounce 1s ease 3');
        } else {
            setAnimation('');
        }
    }, [shouldBounce]);

    return (
        <>
            <Stack>
                <Center>
                    <div
                        style={{
                            cursor: 'pointer',
                            animation,
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundImage: `url(${assets.AddProfile})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        onClick={onClick}
                    />
                </Center>
                <Center>
                    <Text fw={700} size={'sm'} mt={-10}>Add Profile Details</Text>
                </Center>
            </Stack>
        </>
    );
};

export default BouncingAvatar;