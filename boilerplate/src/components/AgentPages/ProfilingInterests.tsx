//@ts-nocheck
import React from 'react';
import { Group, Text, Avatar, Center } from '@mantine/core';
import assets from './assets';

type AssetKeys = keyof typeof assets;

interface ProfilingInterestsProps {
    profilingInterests: AssetKeys[];
}

const ProfilingInterests: React.FC<ProfilingInterestsProps> = ({ profilingInterests }) => {
    const ICON_SIZE = 80;

    return (
        <Group position="center">
            {profilingInterests.map((interest) => {
                if (interest) {
                    const url = assets[interest];

                    return (
                        <div key={interest}>
                            <Avatar
                                size={ICON_SIZE}
                                radius={ICON_SIZE}
                                src={url}
                            />
                            <Center>
                                <Text fw={550} size={15}>{interest}</Text>
                            </Center>
                        </div>
                    );
                }
            })}
        </Group>
    );
};

export default ProfilingInterests;