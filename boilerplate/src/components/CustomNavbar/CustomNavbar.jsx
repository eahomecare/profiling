import React from 'react';
import { Navbar, ActionIcon } from "@mantine/core";
import { IconSettings, Icon3dCubeSphere, IconAccessible, IconLayoutAlignBottom, IconAnalyze, IconArrowBadgeDown } from "@tabler/icons-react";
import { Stack, Space } from "@mantine/core";

const CustomNavbar = () => {
    return (
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
    );
};

export default CustomNavbar;
