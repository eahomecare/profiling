import { ActionIcon, Center, Container, Flex, Group, Header, Image, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../contexts/AuthContext"
import LightDarkButton from "../Dashboard/LightDarkButton"
import { getCustomers } from "./GetCustomers"
import TableDisplay from "./TableDisplay"
import eaLogo from './assets/eaLogo.png'

const CustomersTable = () => {
    const { token } = useAuthContext()
    const [isLoading, setIsLoading] = useState(true)
    const [customerList, setCustomerList] = useState()

    useEffect(() => {
        if (token != '') {
            getCustomers(token)
                .then(setCustomerList)
                .then(() => setIsLoading(false))
                .then(() => console.log('customerList', customerList))

        }
    }, [token])

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
            <>
                <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
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
                                    <Title pl={5}>Customers</Title>
                                </span>
                                <span>
                                    <Container>
                                        <Center>
                                            <Flex mt={5}>
                                                <TextInput w={30} />
                                                <Text mt={5} ml={5} fw={20}>Items per page</Text>
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
                            <TableDisplay customerList={customerList} />
                        </div>
                    </span>
                </div>
            </>
        )
    }
}

export default CustomersTable