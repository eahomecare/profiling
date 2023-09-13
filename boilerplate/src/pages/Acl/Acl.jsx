import { Modal, Navbar, AppShell, MultiSelect, Button, ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
    getAllRolesPermissionsMappings, getUserRolesPermissionsByMapping,
    getAllPermissionsByRole, getAllPermissions, createRolesPermissionMapping, getAllRolesPermissionsMappingsByUser, getAllRoles
} from "../../redux/rolesPermissionSlice"
import { Table } from "@mantine/core";
import { createStyles, ScrollArea, rem } from '@mantine/core';
import { Select } from '@mantine/core';
import { getUsers } from "../../redux/authSlice"
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar"
import AssignPermissionModal from "./AssignPermissionModal"
import PermissionRoleMappings from "./PermissionRoleMapping"
import MainHeader from "../../components/MainHeader/MainHeader"
import Users from "./Users"
import { MainLinks } from "./_mainLink"
import RolesVsPermissions from "./RolesVsPermissions"
import { useLocation } from "react-router-dom"


function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


const Acl = () => {
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


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedPermission, setSelectedPermission] = useState(null)
    const [selectedUserRoleName, setSelectedUserRoleName] = useState(null)
    const [selectedLink, setSelectedLink] = useState(null)
    const location = useLocation();

    const dispatch = useDispatch();

    const { rolesPermissionsStatus, rolesPermissions, userPermissions,
        permissionsByRole, permissionsByRoleStatus, permissions, roles } = useSelector(state => state.rolePermission);
    const { user, users } = useSelector(state => state.auth)

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

    console.log(location.pathname);

    useEffect(() => {
        dispatch(getAllRolesPermissionsMappings());
        dispatch(getUsers())
        dispatch(getAllPermissions())
        dispatch(getAllRoles())
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


    const rolesPermissionsMapping_initialData = rolesPermissions.map((data) => ({
        id: data.id,
        rolename: data.role.name,
        permissionname: data.permission.name,
        username: data.user.email,
        isactive: data.isActive ? "active" : "inactive",
        created_at: formatDate(data.created_at),
    }));

    const users_initialData = Object.keys(userPermissionsDict).length > 0 && users.map((data) => ({
        id: data.id,
        email: data.email,
        isactive: "active",
        role: data.role.name,
        permissions: userPermissionsDict[data.id].join(" / "),
        created_at: formatDate(data.created_at)
    }))


    users.map(d => {
        console.log(userPermissionsDict[d.id]);
    })

    const roles_initialData = roles.map((data) => ({
        id: data.id,
        name: data.name,
        permissions: (data.defaultPermissions.map((permission) => permission.name)).join(" / "),
        created_at: formatDate(data.created_at)
    }))


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


    if (rolesPermissionsStatus === 'loading' || !users || users.length === 0) {
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
                // header={<MainHeader />}
                >
                    <div style={{ display: 'flex', }}>
                        {/* <span>
                            <CustomNavbar />
                        </span> */}

                        <span style={{ flexGrow: '1', width: '100px' }}>
                            <div style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '5px' }}>
                                    <span>
                                        <Title pl={5}>ACL</Title>
                                    </span>
                                    <span>
                                        <Container>
                                            <Navbar height={600} p="xs" width={{ base: 300 }} ml={40}>

                                                <Navbar.Section mt="xs">
                                                    {/* <User /> */}
                                                </Navbar.Section>
                                                <Navbar.Section grow mt="md">
                                                    <MainLinks />
                                                </Navbar.Section>
                                                <Navbar.Section style={{ textAlign: "center" }}>
                                                    <Button variant="light" size="xl">Back</Button>
                                                </Navbar.Section>
                                            </Navbar>
                                            <Center>
                                                <Flex mt={5}>
                                                    {location.pathname === "/acl/permissionrolemappings" && (
                                                        <>
                                                            <Button
                                                                variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}
                                                                className="mt-4"
                                                                onClick={handleAddRoleClick}
                                                            >
                                                                Assign permissions
                                                            </Button>

                                                            <AssignPermissionModal
                                                                isModalOpen={isModalOpen}
                                                                handleModalClose={handleModalClose}
                                                                selectedUserRoleName={selectedUserRoleName}
                                                                selectedUser={selectedUser}
                                                                setSelectedUser={setSelectedUser}
                                                                permissions={permissions}
                                                                selectedPermission={selectedPermission}
                                                                setSelectedPermission={setSelectedPermission}
                                                                rolesPermissions={rolesPermissions}
                                                                handleAssignPermission={handleAssignPermission}
                                                                users={users}
                                                                selectedRole={selectedRole}
                                                            />
                                                        </>

                                                    )
                                                    }

                                                    {/* <Container mt={5}>
                                                        <Flex>
                                                            <ActionIcon>
                                                                <IconChevronLeft />
                                                            </ActionIcon>
                                                            <ActionIcon>
                                                                <IconChevronRight />
                                                            </ActionIcon>
                                                        </Flex>
                                                    </Container> */}
                                                </Flex>
                                            </Center>
                                        </Container>
                                    </span>
                                </div>
                                <div>
                                    <Routes>
                                        <Route>
                                            <Route
                                                index
                                                element={
                                                    <PermissionRoleMappings useStyles={useStyles} initialData={rolesPermissionsMapping_initialData} />
                                                }
                                            />
                                            <Route
                                                path="/permissionrolemappings"
                                                element={
                                                    <PermissionRoleMappings
                                                        title={"acl/permissions vs users"}
                                                        useStyles={useStyles}
                                                        initialData={rolesPermissionsMapping_initialData} />
                                                }
                                            />
                                            <Route
                                                path="/users"
                                                element={
                                                    <Users title={"acl/users"} useStyles={useStyles} initialData={users_initialData} />
                                                }
                                            />
                                            <Route
                                                path="/rolesvspermissions"
                                                element={
                                                    <RolesVsPermissions title={"acl/roles vs permissions"}
                                                        useStyles={useStyles} initialData={roles_initialData} />
                                                }
                                            />
                                        </Route>
                                    </Routes>
                                </div>
                            </div>
                        </span>
                    </div>
                </AppShell>
            </>
        )
    }
}

export default Acl;