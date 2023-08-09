import { Modal, Button, ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";
import TableDisplay from "../../components/TableDisplay"
import { EditableTable } from "../../components/EditableTable/EditableTable"
import { getAllRolesPermissionsMappings } from "../../redux/rolesPermissionSlice"
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

    const dispatch = useDispatch();

    const { rolesPermissionsStatus, rolesPermissions } = useSelector(state => state.rolePermission);

    useEffect(() => {
        dispatch(getAllRolesPermissionsMappings());
        dispatch(getUsers())
    }, []);




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
        setIsModalOpen(true); // Open the modal when button is clicked
    };


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
                                                    onClose={() => setIsModalOpen(false)}
                                                    title="Assign permissions"

                                                >
                                                    <br />
                                                    <Select
                                                        label="Select user"
                                                        placeholder="Pick one"
                                                        data={[
                                                            { value: 'react', label: 'React' },
                                                            { value: 'ng', label: 'Angular' },
                                                            { value: 'svelte', label: 'Svelte' },
                                                            { value: 'vue', label: 'Vue' },
                                                        ]}
                                                    />
                                                    <Select
                                                        label="Select role"
                                                        placeholder="Pick one"
                                                        data={[
                                                            { value: 'react', label: 'React' },
                                                            { value: 'ng', label: 'Angular' },
                                                            { value: 'svelte', label: 'Svelte' },
                                                            { value: 'vue', label: 'Vue' },
                                                        ]}
                                                    />
                                                    <Select
                                                        label="Select permission"
                                                        placeholder="Pick one"
                                                        data={[
                                                            { value: 'react', label: 'React' },
                                                            { value: 'ng', label: 'Angular' },
                                                            { value: 'svelte', label: 'Svelte' },
                                                            { value: 'vue', label: 'Vue' },
                                                        ]}
                                                    />

                                                    <br />

                                                    <Button
                                                        variant="gradient" gradient={{ from: 'indigo', to: 'red' }}
                                                        className="mt-4"
                                                        onClick={handleAddRoleClick}
                                                    >
                                                        Create
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


                                <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
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