import { Header, Text, TextInput, ActionIcon } from "@mantine/core";
import LightDarkButton from "../components/LightDarkButton";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";

const MainHeader = () => {
    return (
        <Header height={{ base: 50, md: 70 }} p="md" withBorder={false} m={'md'}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
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
    );
};

export default MainHeader;