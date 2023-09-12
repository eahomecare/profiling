import React from 'react';
import {
    IconGitPullRequest,
    IconAlertCircle,
    IconMessages,
    IconDatabase,
} from '@tabler/icons-react';
import { IconUsersGroup, IconSettings, IconSquare } from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text, Button } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';




function MainLink({ icon, color, label, link }) {
    return (

        <NavLink to={link}>
            <UnstyledButton sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },

                '&:active': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}>

                <Group>
                    <ThemeIcon color={color} variant="light">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{label}</Text>
                </Group>

            </UnstyledButton>

        </NavLink>
    );
}

const data = [
    { icon: <IconUsersGroup size="1rem" />, color: 'blue', label: 'Users', link: "users" },
    { icon: <IconDatabase size="1rem" />, color: 'grape', label: 'Roles vs Permission', link: "" },
    { icon: <IconDatabase size="1rem" />, color: 'green', label: 'Permission vs Users', link: "permissionrolemappings" },
];

export function MainLinks({ onLinkSelect }) {
    const links = data.map((link) => <MainLink onClick={() => (onLinkSelect(link))} {...link} key={link.label} />);
    return <div>{links}</div>;
}