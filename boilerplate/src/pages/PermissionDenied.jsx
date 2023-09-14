import { ActionIcon, Center, Container, Flex, Group, Header, LoadingOverlay, Navbar, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAdjustmentsHorizontal, IconAnalyze, IconArrowAutofitUp, IconArrowBadgeDown, IconArrowBadgeUp, IconBlade, IconChevronLeft, IconChevronRight, IconLayoutAlignBottom, IconSearch, IconSettings } from "@tabler/icons-react"
import LightDarkButton from "../components/LightDarkButton";
import { Link } from "react-router-dom";
import { showNotification } from "@mantine/notifications";



const PermissionDenied = () => {

    showNotification({
        type: 'warning',
        title: `Permission Denied!!`,
        message: `You do not have access to this page. Please contact the admin`,
    });
    return (
        <>
            <Center>
                <Text fz="xl" fw={700}>Permission Denied :(</Text>
            </Center>
        </>
    )

}

export default PermissionDenied;