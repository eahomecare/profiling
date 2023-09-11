import React from 'react';
import { Text, TextInput, ActionIcon, Header } from '@mantine/core';
import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import LightDarkButton from '../LightDarkButton';
import Logo from '../assets/logo.svg';
import { Avatar } from '@mantine/core';

const MainHeader = () => {
    return (
        <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
                <Avatar radius="xl" src={Logo} />
                <TextInput
                    placeholder="Search"
                    mb="md"
                    icon={<IconSearch size="0.9rem" stroke={1.5} />}
                    radius='md'
                    rightSection={
                        <ActionIcon variant={'subtle'}>
                            <IconAdjustmentsHorizontal />
                        </ActionIcon>
                    }
                // value={}
                // onChange={}
                />
                <div>
                    <LightDarkButton />
                </div>
            </div>
        </Header>
    );
};

export default MainHeader;
