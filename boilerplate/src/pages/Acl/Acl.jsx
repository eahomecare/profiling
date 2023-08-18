import { Modal, MultiSelect, Button, ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";

import {
    getAllRolesPermissionsMappings, getUserRolesPermissionsByMapping,
    getAllPermissionsByRole, getAllPermissions, createRolesPermissionMapping, getAllRolesPermissionsMappingsByUser
} from "../../redux/rolesPermissionSlice"
import { Table } from "@mantine/core";
import { createStyles, ScrollArea, rem } from '@mantine/core';
import { Select } from '@mantine/core';
import { getUsers } from "../../redux/authSlice"



const Acl = () => {



    const useStyles = createStyles((theme) => ({
        header: {
            position: 'sticky',
            top: 0,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedPermission, setSelectedPermission] = useState(null)
    const [selectedUserRoleName, setSelectedUserRoleName] = useState(null)

    const dispatch = useDispatch();

    const { rolesPermissionsStatus, rolesPermissions, userPermissions,
        permissionsByRole, permissionsByRoleStatus, permissions } = useSelector(state => state.rolePermission);
    const { user, users } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getAllRolesPermissionsMappings());
        dispatch(getUsers())
        dispatch(getAllPermissions())
    }, []);

    useEffect(() => {
        if (selectedUser !== null) {
            const userBySelectedId = users.find(x => x.id === selectedUser);
            if (userBySelectedId.role) {
                setSelectedRole(userBySelectedId.role.id)
                setSelectedUserRoleName(userBySelectedId.role.name)
            }
        }
    }, [selectedUser])


    useEffect(() => {
        if (selectedRole !== null) {
            dispatch(getAllPermissionsByRole(selectedRole));
        }
        setSelectedPermission(null)
    }, [selectedRole])


    const initialData = rolesPermissions.map((data) => ({
        id: data.id,
        rolename: data.role.name,
        permissionname: data.permission.name,
        username: data.user.email,
        isactive: data.isActive ? "active" : "inactive",
        created_at: data.created_at,
    }));

    const rows = initialData.map((row) => (
        <tr key={row.id}>
            <td>{row.rolename}</td>
            <td>{row.permissionname}</td>
            <td>{row.username}</td>
            <td>{row.isactive}</td>
            <td>{row.created_at}</td>
        </tr>
    ));


    const handleAddRoleClick = () => {
        setIsModalOpen(true);
    };


    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
        setSelectedRole(null)
        setSelectedPermission(null)
    }

    const handleAssignPermission = () => {
        dispatch(createRolesPermissionMapping({
            "roleId": selectedRole,
            "permissionId": selectedPermission,
            "userId": selectedUser
        }))
        dispatch(getAllRolesPermissionsMappings())
        handleModalClose()

    }


    if (rolesPermissionsStatus === 'loading') {
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
                <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
                        <Text
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                            ta="center"
                            fz="xl"
                            fw={700}
                            mt={-20}
                        >EAI CRM</Text>
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
                <div style={{ display: 'flex', }}>
                    <span>
                        <Navbar width={{ base: 50 }} height={500} p="xs" withBorder={false}>
                            <Space h={5} />
                            <Stack>
                                <ActionIcon variant="subtle" c='cyan'><IconSettings size="1rem" /></ActionIcon>
                                <ActionIcon variant="subtle" c='cyan'><Icon3dCubeSphere size="1rem" /></ActionIcon>
                                <ActionIcon variant="subtle" c='cyan'><IconAccessible size="1rem" /></ActionIcon>
                                <ActionIcon variant="subtle" c='cyan'><IconLayoutAlignBottom size="1rem" /></ActionIcon>
                                <ActionIcon variant="subtle" c='cyan'><IconAnalyze size="1rem" /></ActionIcon>
                                <ActionIcon variant="gradient" gradient={{ from: 'black', to: 'indigo' }}><IconArrowBadgeDown size="1rem" /></ActionIcon>
                            </Stack>
                        </Navbar>
                    </span>
                    <span style={{ flexGrow: '1', width: '100px' }}>
                        <div style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '5px' }}>
                                <span>
                                    <Title pl={5}>ACL</Title>
                                </span>
                                <span>
                                    <Container>
                                        <Center>
                                            <Flex mt={5}>
                                                <Button
                                                    variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}
                                                    className="mt-4"
                                                    onClick={handleAddRoleClick}
                                                >
                                                    Assign permissions
                                                </Button>
                                                <Modal
                                                    opened={isModalOpen}
                                                    onClose={handleModalClose}
                                                    title="Assign permissions"
                                                    size="lg"
                                                    style={{ content: { maxHeight: '80vh' } }}

                                                >
                                                    <Text fz="xl">Select user below assigning new permission</Text>
                                                    {selectedUserRoleName && <Text> ROLE : {selectedUserRoleName}</Text>}
                                                    <br /><br />
                                                    <Select
                                                        label="Select user"
                                                        placeholder="Pick one"
                                                        data={users.map((user) => ({
                                                            value: user.id,
                                                            label: user.agentName || user.email,
                                                        }))}
                                                        value={selectedUser}
                                                        onChange={setSelectedUser}


                                                    />


                                                    {Array.isArray(permissions) && permissions.length > 0 ? (
                                                        <Select
                                                            label="Select permission"
                                                            placeholder="Pick one"
                                                            disabled={selectedRole === null}
                                                            data={permissions?.map((permission) => ({
                                                                value: permission.id,
                                                                label: permission.name,
                                                                disabled: rolesPermissions.some(rolesPermission => (rolesPermission.permissionId === permission.id && rolesPermission.userId === selectedUser))
                                                            }))}
                                                            value={selectedPermission}
                                                            onChange={setSelectedPermission}
                                                            dropdownComponent="div"
                                                        />
                                                    ) : (<Text>Loading permissions</Text>)}


                                                    <br />

                                                    <Button
                                                        variant="gradient" gradient={{ from: 'indigo', to: 'red' }}
                                                        className="mt-4"
                                                        onClick={handleAssignPermission}
                                                        disabled={selectedRole === null || selectedPermission === null || selectedRole === null}
                                                    >
                                                        Assign
                                                    </Button>

                                                </Modal>
                                                <Container mt={5}>
                                                    <Flex>
                                                        <ActionIcon>
                                                            <IconChevronLeft />
                                                        </ActionIcon>
                                                        <ActionIcon>
                                                            <IconChevronRight />
                                                        </ActionIcon>
                                                    </Flex>
                                                </Container>
                                            </Flex>
                                        </Center>
                                    </Container>
                                </span>
                            </div>

                            <div>


                                <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                    <Table miw={700}>
                                        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                            <tr>
                                                <th>Role Name</th>
                                                <th>Permission Name</th>
                                                <th>User Email</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </div>
                    </span>
                </div>
            </>
        )
    }
}

export default Acl;