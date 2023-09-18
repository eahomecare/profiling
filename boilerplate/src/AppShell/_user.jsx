import React, { useState } from 'react';
import { IconChevronRight, IconChevronLeft, IconSettings, IconMessageCircle, IconPhoto, IconSearch, IconArrowsLeftRight, IconTrash, IconLogout, IconUser, IconKey, IconNotification, IconBell } from '@tabler/icons-react';
import { UnstyledButton, Group, Avatar, Text, Box, Menu, useMantineTheme, rem } from '@mantine/core';
import { Link } from 'react-router-dom';

const User = ({ user, roleName }) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <Group position="center">
            <Menu
                position='right-start'
                withinPortal
                offset={5}
                withArrow
                opened={opened}
                onChange={(isOpen) => setOpened(isOpen)}>
                <Menu.Target>
                    <UnstyledButton
                        onClick={() => setOpened(prev => !prev)}
                        sx={{
                            display: 'block',
                            width: '100%',
                            padding: theme.spacing.xs,
                            borderRadius: theme.radius.sm,
                            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                            '&:hover': {
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            },
                        }}
                    >
                        <Group>
                            <Avatar
                                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80'}
                                radius="xl"
                            />
                            <Box sx={{ flex: 1 }}>
                                <Text size="sm" weight={500}>
                                    {user?.email?.split("@")[0]}
                                </Text>
                                <Text color="dimmed" size="xs">
                                    {roleName}
                                </Text>
                            </Box>

                            {theme.dir === 'ltr' ? (
                                <IconChevronRight size={rem(18)} />
                            ) : (
                                <IconChevronLeft size={rem(18)} />
                            )}
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Account Management</Menu.Label>
                    <Link to="/myAccount" style={{ textDecoration: "none" }}>
                        <Menu.Item icon={<IconUser size={14} />}>My Account</Menu.Item>
                    </Link>
                    <Link to="/securitySettings" style={{ textDecoration: "none" }}>
                        <Menu.Item icon={<IconKey size={14} />}>Security Settings</Menu.Item>
                    </Link>
                    <Menu.Item icon={<IconBell size={14} />}>Notifications</Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item icon={<IconLogout size={14} />}>Logout</Menu.Item>
                    <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group >
    );
}

export default User;