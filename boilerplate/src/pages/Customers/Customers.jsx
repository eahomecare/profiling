import { ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import LightDarkButton from "../../components/LightDarkButton"
import { getCustomers, getCustomersProfileCompleteness } from "../../redux/customerSlice"
import { useDispatch, useSelector } from "react-redux";
import TableDisplay from "../../components/TableDisplay"
import { Link } from "react-router-dom";



const Customers = () => {


    const dispatch = useDispatch();

    const { status, customers, fetchedPofileCompleteness } = useSelector(state => state.customer);

    // if(Array.isArray(customers) && customers.length > 0) setCustomerList(customers)

    useEffect(() => {
        dispatch(getCustomers());
        dispatch(getCustomersProfileCompleteness())
    }, []);




    if (status === 'loading') {
        return (
            <LoadingOverlay visible overlayBlur={2}
                loaderProps={{
                    size: 'xl',
                    variant: 'dots',
                }}
            />
        )
    }
    else {
        return (
            <>
                <div style={{ display: 'flex', }}>
                    <span style={{ flexGrow: '1', width: '100px' }}>
                        <div style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '5px' }}>
                                <span>
                                    <Title pl={5}>Customers</Title>
                                </span>
                            </div>
                            <TableDisplay customerList={customers} fetchedPofileCompleteness={fetchedPofileCompleteness} />
                        </div>
                    </span>
                </div>
            </>
        )
    }
}

export default Customers;
