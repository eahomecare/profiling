import { useState, useEffect } from 'react';
import {
    AppShell,
    Header,
    MediaQuery,
    Burger,
    useMantineTheme,
    Card,
    Container,
    LoadingOverlay,
    TextInput,
    ActionIcon,
    Image,
} from '@mantine/core';
import { Route, Routes, useLocation } from 'react-router-dom';
import LightDarkButton from './LightDarkButton'
import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import KeywordsEntry from '../KeywordsEntry/KeywordsEntry';
import PersonalInformation from '../PersonalInformation/PersonalInformation';
import Interests from '../Interests/Interests';
import DashboardNavbar from './DashboardNavbar';
import Profiling from '../Profiling/Profiling';
import eaLogo from './assets/eaLogo.png'
import { Occupation } from '../Occupation/Occupation';
import { FamilyDetails } from '../FamilyDetails/FamilyDetails';
import FinancialInformation from '../FinancialInformation/FinancialInformation';
import { InsuranceDetails } from '../InsuranceDetails/InsuranceDetails';
import { VehicleDetails } from '../VehicleDetails/VehicleDetails';
import { SocialMediaDetails } from '../SocialMedia/socialMedia';
import Health from '../Health/Health';

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

                            <Image
                                width={90}
                                height={90}
                                src={eaLogo}
                                mt={10}
                            />
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
                                <Route path='/occupation' element={<Occupation />} />
                                <Route path='/familyDetails' element={<FamilyDetails />} />
                                <Route path='/financialInformation' element={<FinancialInformation />} />
                                <Route path='/insuranceDetails' element={<InsuranceDetails />} />
                                <Route path='/vehicle' element={<VehicleDetails />} />
                                <Route path='/health' element={<Health />} />
                                <Route path='/socialMedia' element={<SocialMediaDetails />} />
                            </Route>
                        </Routes>
                    </Card>
                </Container>
            </AppShell>
        );
    }

}

export default Dashboard