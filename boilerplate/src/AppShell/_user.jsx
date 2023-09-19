import React, { useState } from 'react';
import { createStyles, useMantineTheme, getStylesRef, NavLink, UnstyledButton, Group, Avatar, Box, Text, rem, Card, Navbar, Menu } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconUser, IconKey, IconBell, IconLogout, IconTrash, IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#4E70EA',
            color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? '#252D3B' : '#4E70EA',
            color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },
}));

const User = ({ user, roleName }) => {
    const { classes, cx } = useStyles();
    const theme = useMantineTheme();

    return (
        <div>

            <Menu trigger="hover" openDelay={100} closeDelay={400}>
                <Menu.Target>
                    <UnstyledButton
                        // onClick={() => setOpened(prev => !prev)}
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

                            <IconChevronDown size={rem(18)} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown bg={'transparent'}>
                    <Box>
                        <Card bg={'#FFFFFF'} shadow='xl' radius={'md'}>
                            <NavLink
                                component={Link}
                                to="/myAccount"
                                label="My Account"
                                icon={<IconUser size={14} />}
                                className={cx(classes.link, classes.linkIcon)}
                            />
                            <NavLink
                                component={Link}
                                to="/securitySettings"
                                label="Security Settings"
                                icon={<IconKey size={14} />}
                                className={cx(classes.link, classes.linkIcon)}
                            />
                            <NavLink
                                component="div"
                                label="Notifications"
                                icon={<IconBell size={14} />}
                                className={cx(classes.link, classes.linkIcon)}
                            />
                            <NavLink
                                component="div"
                                label="Logout"
                                icon={<IconLogout size={14} />}
                                className={cx(classes.link, classes.linkIcon)}
                            />
                            <NavLink
                                component="div"
                                label="Delete my account"
                                color="red"
                                icon={<IconTrash size={14} />}
                                className={cx(classes.link, classes.linkIcon)}
                            />
                        </Card>
                    </Box>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}

export default User;