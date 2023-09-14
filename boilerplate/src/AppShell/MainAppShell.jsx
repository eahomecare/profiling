import { ActionIcon, Avatar, Center, Container, Flex, Group, Header, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from '../components/assets/logo.svg';



const MainAppShell = ({ children }) => {

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
                    <Navbar width={{ base: 50 }} height={500} p="xs" withBorder={false}>
                        <Space h={5} />
                        <Stack>
                            <Link to="/acl">
                                <ActionIcon variant="subtle" c="cyan">
                                    <IconSettings size="1rem" />
                                </ActionIcon>
                            </Link>
                            <Link to="/campaign">
                                <ActionIcon variant="subtle" c='cyan'><Icon3dCubeSphere size="1rem" /></ActionIcon>
                            </Link>
                            <Link to="/customers">
                                <ActionIcon variant="subtle" c='cyan'><IconAccessible size="1rem" /></ActionIcon>
                            </Link>
                            <Link to="/">
                                <ActionIcon variant="subtle" c='cyan'><IconLayoutAlignBottom size="1rem" /></ActionIcon>
                            </Link>
                            <ActionIcon variant="subtle" c='cyan'><IconAnalyze size="1rem" /></ActionIcon>
                            <ActionIcon variant="gradient" gradient={{ from: 'black', to: 'indigo' }}><IconArrowBadgeDown size="1rem" /></ActionIcon>
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
