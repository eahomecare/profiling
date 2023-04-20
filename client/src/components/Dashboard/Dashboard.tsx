import { useState, useEffect } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Card,
    NavLink,
    Container,
    LoadingOverlay,
    TextInput,
    ActionIcon,
} from '@mantine/core';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import LightDarkButton from './LightDarkButton'
import { IconAdjustmentsHorizontal, IconArrowNarrowLeft, IconBriefcase, IconCar, IconCarCrash, IconCircleKey, IconComet, IconFriends, IconHammer, IconHealthRecognition, IconPalette, IconReportMoney, IconSearch, IconSocial, IconTimeline, IconUser } from '@tabler/icons-react';
import KeywordsEntry from '../KeywordsEntry/KeywordsEntry';
import PersonalInformation from '../PersonalInformation/PersonalInformation';
import Interests from '../Interests/Interests';
import DashboardNavbar from './DashboardNavbar';
import Profiling from '../Profiling/Profiling';

const Dashboard = () => {
    const [selectedCustomer, setSelectedCustomer] = useState()
    const [isLoading, setIsLoading] = useState(true)
    let customer: any
    const location = useLocation()
    useEffect(() => {
        setTimeout(() => {
            if (location?.state?.customer) {
                customer = location.state.customer
                setSelectedCustomer(customer)
                setIsLoading(false)
            }
        }, 2000)
    }, [])
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    if (isLoading) {
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
            <AppShell
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : 'white',
                    },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                fixed
                navbar={<DashboardNavbar opened={opened} setOpened={setOpened} />
                    // <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened}
                    //     width={{ sm: 200, lg: 300 }}
                    //     withBorder={false}
                    // >
                    //     <Navbar.Section grow mt={'lg'}>
                    //         <Card
                    //             shadow={'md'}
                    //             radius={'md'}
                    //             bg={theme.colorScheme == 'light' ? '#DDE5FF' : ''}
                    //         >
                    //             <div style={{ display: 'flex', flexDirection: 'column' }}>
                    //                 <NavLink icon={<IconUser />} component={Link} variant="subtle" to='personalInformation' label={'Personal Information'} />
                    //                 <NavLink icon={<IconCircleKey />} component={Link} variant="subtle" to='keywords' label={'Keywords'} />
                    //                 <NavLink icon={<IconTimeline />} component={Link} variant="subtle" to='profiling' label={'Profiling'} />
                    //                 <NavLink icon={<IconPalette />} component={Link} variant="subtle" to='interests' label={'Interests'} />
                    //                 <NavLink icon={<IconBriefcase />} component={Link} variant="subtle" to='Occupation' label={'Occupation'} />
                    //                 <NavLink icon={<IconComet />} component={Link} variant="subtle" to='Activity' label={'Activity'} />
                    //                 <NavLink icon={<IconFriends />} component={Link} variant="subtle" to='Family Details' label={'Family Details'} />
                    //                 <NavLink icon={<IconReportMoney />} component={Link} variant="subtle" to='Financial Information' label={'Financial Information'} />
                    //                 <NavLink icon={<IconCarCrash />} component={Link} variant="subtle" to='Insurance Details' label={'Insurance Details  '} />
                    //                 <NavLink icon={<IconCar />} component={Link} variant="subtle" to='Vehicle' label={'Vehicle'} />
                    //                 <NavLink icon={<IconHealthRecognition />} component={Link} variant="subtle" to='Health' label={'Health'} />
                    //                 <NavLink icon={<IconSocial />} component={Link} variant="subtle" to='Social Media' label={'Social Media'} />
                    //             </div>
                    //         </Card>
                    //     </Navbar.Section>
                    //     <Navbar.Section>
                    //         <NavLink icon={<IconArrowNarrowLeft />} component={Link} variant="subtle" to='/customers' label={'Go Back'} active rightSection />
                    //     </Navbar.Section>
                    // </Navbar>
                }
                header={
                    <Header height={{ base: 50, md: 70 }}
                        p="md"
                        m={"md"}
                        withBorder={false}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>

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
                }
            >
                <Container >
                    <Card mt={20} shadow={'lg'} bg={theme.colorScheme == 'light' ? '#F1F5F9' : ''}
                        radius={'md'}
                        mih={510}
                    >
                        <Routes>
                            <Route
                            // element={<Dashboard />}
                            >
                                <Route index element={<PersonalInformation selectedCustomer={selectedCustomer} />} />
                                <Route path='/personalInformation' element={<PersonalInformation selectedCustomer={selectedCustomer} />} />
                                <Route path='/keywords' element={<KeywordsEntry selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />} />
                                <Route path='/profiling' element={<Profiling />} />
                                <Route path='/interests' element={<Interests selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />} />
                            </Route>
                        </Routes>
                    </Card>
                </Container>
            </AppShell>
        );
    }

}

export default Dashboard