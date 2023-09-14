import { ActionIcon, Avatar, Button, Center, Container, Flex, Group, Header, NavLink, Box, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconSettingsAutomation, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from '../components/assets/logo.svg';



const MainAppShell = ({ children }) => {

    const location = useLocation();
    const [activeNavLink, setActiveNavLink] = useState("")


    useEffect(() => {
        const pathname = location.pathname;
        setActiveNavLink(pathname);
    }, [location.pathname]);


    return (
        <>
            <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
                    <Avatar radius="xl" src={Logo} />
                    <Flex justify={'space-between'}>
                        <Center>
                            <LightDarkButton />
                            <Avatar ml={10} radius={'xl'} src={null} alt="no image here" color="indigo" />
                        </Center>
                    </Flex>
                </div>
            </Header>
            <div style={{ display: 'flex', }}>
                <span>
                    <Navbar height={500} p="xs" withBorder={false}>
                        <Space h={5} />
                        <Stack>
                            <Link to="/acl" style={{ textDecoration: "none", fontWeight: "900" }}>
                                <NavLink
                                    label="Acl"
                                    icon={<IconSettingsAutomation size="2rem" stroke={2.0} />}
                                    active={activeNavLink === "/acl"}

                                >
                                </NavLink>
                            </Link>
                            <Link to="/campaign" style={{ textDecoration: "none" }}>
                                <NavLink
                                    label="Campaign"
                                    icon={<Icon3dCubeSphere size="2rem" stroke={2} />}
                                    active={activeNavLink === "/campaign"}
                                >
                                </NavLink>
                            </Link>
                            <Link to="/customers" style={{ textDecoration: "none" }}>
                                <NavLink
                                    label="Customers"
                                    icon={<IconAccessible size="2rem" stroke={2} />}
                                    active={activeNavLink === "/customers"}

                                >
                                </NavLink>
                            </Link>
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <NavLink
                                    label="Dashboard"
                                    icon={<IconAnalyze size="2rem" stroke={2} />}
                                    active={activeNavLink === "/"}

                                >
                                </NavLink>
                            </Link>
                        </Stack>
                    </Navbar>
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
