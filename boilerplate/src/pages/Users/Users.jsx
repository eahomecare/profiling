
import { Modal, Navbar, AppShell, MultiSelect, Button, ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Space, Stack, Text, TextInput, Title, Box } from "@mantine/core"
import { Icon3dCubeSphere, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRolesPermissionsMappings, getAllPermissions, getAllRoles
} from "../../redux/rolesPermissionSlice"
import { Table } from "@mantine/core";
import { createStyles, ScrollArea, rem } from '@mantine/core';
import { getUsers, addUser } from "../../redux/authSlice"
import { useLocation } from "react-router-dom"
import AddUserModal from "./AddUserModal";
import UserActionModal from "./UserActionModal";
import { notifications } from '@mantine/notifications';





function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}



function showNotification(prop){
    notifications.show({
        title: 'Success',
        message: prop,
        styles: (theme) => ({
          root: {
            backgroundColor: "#4E70EA",
            borderColor: theme.colors.blue[6],

            '&::before': { backgroundColor: theme.white },
          },

          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.blue[7] },
          },
        }),
      })
}


const Users = () => {
    const useStyles = createStyles((theme) => ({
        header: {
            position: 'sticky',
            top: 0,
            backgroundColor: "#4E70EA",
            fontColor: "red",
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
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    const [isUserActionModalOpen, setUserActionModalOpen] = useState(false)
    const location = useLocation();
    const dispatch = useDispatch();
    const { rolesPermissions, roles, permissions } = useSelector(state => state.rolePermission);
    const { users } = useSelector(state => state.auth)
    const userPermissionsDict = {};
    const [userDetails, setUserDetails] = useState({
        "firstname": null,
        "lastname": null,
        "email": null,
        "role": null,
        "mobile": null
    })
    const [curr_user, setCurrUser] = useState(null)

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

    const handleUserActionModal = (selected_user) => {
        setCurrUser(selected_user)
        setUserActionModalOpen(true)
    }



    useEffect(() => {
        dispatch(getAllRolesPermissionsMappings());
        dispatch(getUsers())
        dispatch(getAllPermissions())
        dispatch(getAllRoles())
    }, []);

    const userRolesPermissions = curr_user && rolesPermissions.filter(item => item.userId === curr_user.id);


    const userPermissionsOptions = []
    if (curr_user) {
        permissions.map((data) => {
            if (!userPermissionsDict[curr_user.id].includes(data.name)) {
                userPermissionsOptions.push({ value: data.id, label: data.name })
            }
        })
    }



    const initialData = Object.keys(userPermissionsDict).length > 0
        ? users.map((data) => ({
            id: data.id,
            roleId:data.roleId,
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
                <td><Button color='teal' size="xs" compact>{row.isactive}</Button></td>
                <td>{row.created_at}</td>
                <td onClick={() => (handleUserActionModal(row))}><ActionIcon variant="light"><IconSettings size="1rem" /></ActionIcon></td>
            </tr>
        ))
        : [];

    const rolesData = roles && Array.isArray(roles) && roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));


    const handleModalClose = () => {
        if (isAddUserModalOpen) setAddUserModalOpen(false)
        if (isUserActionModalOpen) setUserActionModalOpen(false)

    }


    const handleAddUserModal = () => {
        setAddUserModalOpen(true)
    }


    const handleAddUser =  async() => {
        try {
            const userData = {
                "email": userDetails.email,
                "mobile": userDetails.mobile,
                "fullname": `${userDetails.firstname} ${userDetails.lastname}`,
                "roleId": userDetails.role
            }
            await dispatch(addUser(userData));
            await dispatch(getAllRolesPermissionsMappings());
            setAddUserModalOpen(false)
            showNotification("added user successfully")
        } catch (error) {
            console.log(error);
        }
    };


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
                    <Box sx={{ backgroundColor: "#DDE5FF",padding:"50px",marginTop:"-80px" }}>
                        <div style={{ display: 'flex', }}>
                            <span style={{ flexGrow: '1', width: '100px' }}>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '-65px'}}>
                                        <span style={{padding:"10px"}}>
                                            <Title pl={5}>Users</Title>
                                        </span>
                                        <span>
                                            <Container>
                                                <Center>
                                                    <Flex mt={5}>
                                                        <Button
                                                            className="mt-4"
                                                            onClick={handleAddUserModal}
                                                            style={{backgroundColor:"black",fontColor:"white"}}
                                                        >
                                                            + Add User
                                                        </Button>
                                                        
                                                        <AddUserModal
                                                            isModalOpen={isAddUserModalOpen}
                                                            handleAddUser={handleAddUser}
                                                            handleModalClose={handleModalClose}
                                                            userDetails={userDetails}
                                                            setUserDetails={setUserDetails}
                                                            rolesData={rolesData}
                                                        />

                                                    </Flex>
                                                </Center>
                                            </Container>
                                        </span>
                                    </div>
                                    <div>

                                        {isUserActionModalOpen &&
                                            <UserActionModal
                                                isModalOpen={isUserActionModalOpen}
                                                handleModalClose={handleModalClose}
                                                curr_user={curr_user}
                                                userRolesPermissions={userRolesPermissions}
                                                userPermissionsOptions={userPermissionsOptions}
                                                classes={classes}
                                                cx={cx}
                                            />

                                        }

                                        <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                            <Table miw={700} withBorder highlightOnHover withColumnBorders>
                                                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                                    <tr>
                                                        <th>
                                                            <Text color="white">Email</Text>
                                                        </th>
                                                        <th>
                                                            <Text color="white">Role</Text>
                                                        </th>
                                                        <th>
                                                            <Text color="white">Permissions</Text>
                                                        </th>
                                                        <th>
                                                            <Text color="white">Status</Text>
                                                        </th>
                                                        <th>
                                                            <Text color="white">Created At</Text>
                                                        </th>
                                                        <th>
                                                            <Text color="white">Action</Text>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>{rows}</tbody>
                                            </Table>
                                        </ScrollArea>

                                    </div>
                                </div>
                            </span>
                        </div>

                    </Box>

                </AppShell>
            </>
        )
    }
}

export default Users
