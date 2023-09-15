// import React, { useState } from 'react';
// import { ScrollArea, Table, Title, Button } from '@mantine/core';
// import { ActionIcon } from '@mantine/core';
// import { IconSettings } from '@tabler/icons-react';

// const Users = ({ useStyles, initialData, title }) => {

//     const { classes, cx } = useStyles();
//     const [scrolled, setScrolled] = useState(false);

//     const rows = initialData.map((row) => (
//         <tr key={row.id}>
//             <td>{row.email}</td>
//             <td>{row.role}</td>
//             <td>{row.permissions}</td>
//             <td><Button color='green' size="xs" compact>{row.isactive}</Button></td>
//             <td>{row.created_at}</td>
//             <td><ActionIcon variant="light"><IconSettings size="1rem" /></ActionIcon></td>
//         </tr>
//     ));

//     return (
//         <>
//             <Title style={{ padding: "10px" }} order={4} color="blue.5">{title}</Title>
//             <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
//                 <Table miw={700} striped withBorder highlightOnHover withColumnBorders>
//                     <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
//                         <tr>
//                             <th>Email</th>
//                             <th>Role</th>
//                             <th>Permissions</th>
//                             <th>Status</th>
//                             <th>Created At</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>{rows}</tbody>
//                 </Table>
//             </ScrollArea>
//         </>

//     );
// }

// export default Users;



import { Modal, Navbar, AppShell, MultiSelect, Button, ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRolesPermissionsMappings, getAllPermissions, getAllRoles
} from "../../redux/rolesPermissionSlice"
import { Table } from "@mantine/core";
import { createStyles, ScrollArea, rem } from '@mantine/core';
import { getUsers } from "../../redux/authSlice"
import { useLocation } from "react-router-dom"



function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


const Users = () => {
    const useStyles = createStyles((theme) => ({
        header: {
            position: 'sticky',
            top: 0,
            backgroundColor: "#c2c2c2",
            transition: 'box-shadow 150ms ease',

            '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
                    }`,
            },
        },

        scrolled: {
            boxShadow: theme.shadows.sm,
        },
    }));

    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { rolesPermissions } = useSelector(state => state.rolePermission);
    const { users } = useSelector(state => state.auth)
    const userPermissionsDict = {};

    for (const permission of rolesPermissions) {
        const { userId, permission: { name } } = permission;

        if (userPermissionsDict.hasOwnProperty(userId)) {
            userPermissionsDict[userId].push(name);
        } else {
            userPermissionsDict[userId] = [name];
        }
    }

    const allUserIds = users.map(user => user.id);

    for (const userId of allUserIds) {
        if (!userPermissionsDict.hasOwnProperty(userId)) {
            userPermissionsDict[userId] = [];
        }
    }


    useEffect(() => {
        dispatch(getAllRolesPermissionsMappings());
        dispatch(getUsers())
        dispatch(getAllPermissions())
        dispatch(getAllRoles())
    }, []);



    const initialData = Object.keys(userPermissionsDict).length > 0
        ? users.map((data) => ({
            id: data.id,
            email: data.email,
            isactive: "active",
            role: data.role.name,
            permissions: userPermissionsDict[data.id].join(" / "),
            created_at: formatDate(data.created_at)
        }))
        : [];

    const rows = Array.isArray(initialData)
        ? initialData.map((row) => (
            <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.permissions}</td>
                <td><Button color='green' size="xs" compact>{row.isactive}</Button></td>
                <td>{row.created_at}</td>
                <td><ActionIcon variant="light"><IconSettings size="1rem" /></ActionIcon></td>
            </tr>
        ))
        : [];



    if (!users || users.length === 0) {
        return (
            <LoadingOverlay visible overlayBlur={2}
                loaderProps={{
                    size: 'xl',
                    variant: 'dots'
                }}
            />
        )
    }
    else {
        return (
            <>
                <AppShell
                    padding="md"
                >
                    <div style={{ display: 'flex', }}>
                        <span style={{ flexGrow: '1', width: '100px' }}>
                            <div style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '-65px' }}>
                                    <span>
                                        <Title pl={5}>Users</Title>
                                    </span>
                                    <span>
                                        <Container>
                                            <Center>
                                                <Flex mt={5}>
                                                    {/* modal */}
                                                </Flex>
                                            </Center>
                                        </Container>
                                    </span>
                                </div>
                                <div>

                                    <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                        <Table miw={700} striped withBorder highlightOnHover withColumnBorders>
                                            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                                <tr>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Permissions</th>
                                                    <th>Status</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </Table>
                                    </ScrollArea>

                                </div>
                            </div>
                        </span>
                    </div>
                </AppShell>
            </>
        )
    }
}

export default Users;
