import { ActionIcon, Navbar, Space, Stack } from "@mantine/core"
import { Icon3dCubeSphere, IconAccessible, IconAnalyze, IconArrowBadgeDown, IconLayoutAlignBottom, IconSettings } from "@tabler/icons-react"
import { Link } from "react-router-dom"

const MainNavbar = () => {
    return (
        <Navbar width={{ base: 50 }} height={500} p="xs" withBorder={false}>
            <Space h={5} />
            <Stack>
                <Link to="/acl">
                    <ActionIcon variant="subtle" c="cyan">
                        <IconSettings size="1rem" />
                    </ActionIcon>
                </Link>
                <ActionIcon variant="subtle" c='cyan'><Icon3dCubeSphere size="1rem" /></ActionIcon>
                <ActionIcon variant="subtle" c='cyan'><IconAccessible size="1rem" /></ActionIcon>
                <ActionIcon variant="subtle" c='cyan'><IconLayoutAlignBottom size="1rem" /></ActionIcon>
                <ActionIcon variant="subtle" c='cyan'><IconAnalyze size="1rem" /></ActionIcon>
                <ActionIcon variant="gradient" gradient={{ from: 'black', to: 'indigo' }}><IconArrowBadgeDown size="1rem" /></ActionIcon>
            </Stack>
        </Navbar>
    )
}

export default MainNavbar