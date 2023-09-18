import { ActionIcon, Avatar, Button, Center, Container, Flex, Group, Header, NavLink, Box, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title, Card, createStyles, useMantineTheme, getStylesRef } from "@mantine/core";
import { Icon3dCubeSphere, IconUsersGroup, IconAccessible, IconStar, IconSettingsAutomation, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import LightDarkButton from "../components/LightDarkButton";
import { getCustomers, getCustomersProfileCompleteness } from "../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from '../components/assets/logo.svg';
import User from './_user';

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
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },
    linkActive: {
        '&, &:hover': {
            color: theme.colorScheme === 'dark' ? '' : 'white',
            backgroundColor: theme.colorScheme === 'dark' ? '#252D3B' : '#4E70EA',
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },
}));

const MainAppShell = ({ children }) => {
    const { classes, cx } = useStyles();
    const location = useLocation();
    const [activeNavLink, setActiveNavLink] = useState("");
    const { user, users } = useSelector(state => state.auth);
    const theme = useMantineTheme();

    function findUserRoleNameById(userId) {
        const user = users.find(user => user.id === userId);

        if (user) {
            return user.role.name;
        } else {
            return 'User not found';
        }
    }

    useEffect(() => {
        const pathname = location.pathname;
        setActiveNavLink(pathname);
    }, [location.pathname]);

    return (
        <>
            <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
                <Flex justify={"flex-end"}>
                    <Group>
                        <LightDarkButton />
                        <Avatar radius="xl" src={Logo} />
                    </Group>
                </Flex>
            </Header>
            <div style={{ display: 'flex', }}>
                <span>
                    <Card
                        shadow="md"
                        radius={'md'}
                        bg={theme.colorScheme == 'dark' ? '' : '#DDE5FF'}
                    >
                        <Navbar height={500} p="xs" withBorder={false}
                            bg={theme.colorScheme == 'dark' ? '' : '#DDE5FF'}
                        >
                            <Space h={5} />
                            <Navbar.Section>
                                <User user={user} roleName={findUserRoleNameById(user._id)} />
                            </Navbar.Section>
                            <Space h={2} />
                            <Stack>
                                <Link to="/" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/" })}>
                                    <NavLink
                                        label="Dashboard"
                                        icon={<IconAnalyze size="2rem" stroke={2} />}
                                        className={classes.link}
                                    >
                                    </NavLink>
                                </Link>
                                <Link to="/users" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/users" })}>
                                    <NavLink
                                        label="Users"
                                        icon={<IconUsersGroup size="2rem" stroke={2} />}
                                        className={classes.link}
                                    >
                                    </NavLink>
                                </Link>

                                <NavLink
                                    label="ACL"
                                    icon={<IconSettingsAutomation size="2rem" stroke={2.0} />}
                                    active={activeNavLink === "/acl"}
                                    className={classes.link}
                                >
                                    <Link to="/acl/rolesvspermissions" style={{ textDecoration: "none" }}>
                                        <NavLink
                                            label="Roles vs Permission"
                                            icon={<IconSettings size="1rem" stroke={2} />}
                                            active={activeNavLink === "/acl/rolesvspermissions"}
                                            className={classes.link}
                                        >
                                        </NavLink>
                                    </Link>
                                    <Link to="/acl/permissions" style={{ textDecoration: "none" }}>
                                        <NavLink
                                            label="Permissions"
                                            icon={<IconSettings size="1rem" stroke={2} />}
                                            active={activeNavLink === "/acl/permissions"}
                                            className={classes.link}
                                        >
                                        </NavLink>
                                    </Link>
                                </NavLink>

                                <Link to="/campaign" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/campaign" })}>
                                    <NavLink
                                        label="Campaign"
                                        icon={<Icon3dCubeSphere size="2rem" stroke={2} />}
                                        className={classes.link}
                                    >
                                    </NavLink>
                                </Link>

                                <Link to="/customers" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/customers" })}>
                                    <NavLink
                                        label="Customers"
                                        icon={<IconAccessible size="2rem" stroke={2} />}
                                        className={classes.link}
                                    >
                                    </NavLink>
                                </Link>

                            </Stack>
                        </Navbar>
                    </Card>
                </span>
                <span style={{ flexGrow: '1', width: '100px' }}>
                    <div style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '5px' }}>
                        </div>
                        {children}
                    </div>
                </span>
            </div>
        </>
    )
}

export default MainAppShell;