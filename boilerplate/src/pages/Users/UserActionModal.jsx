import { useDisclosure } from '@mantine/hooks';
import { Modal, useMantineTheme, Title, Button, SimpleGrid, Avatar, Text, Grid, Timeline, Space } from '@mantine/core';
import { IconGitBranch, IconGitPullRequest, IconGitCommit, IconMessageDots } from '@tabler/icons-react';

const UserActionModal = ({ isModalOpen, curr_user, handleModalClose }) => {
    const theme = useMantineTheme();

    return (
        <>
            {console.log(curr_user)}
            <Modal
                opened={isModalOpen}
                title="User Actions"
                onClose={handleModalClose}
                overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 3,
                }}
                size={"xl"}


            >

                <Grid>
                    <Grid.Col span={2}>
                        <Avatar src={null} alt="no image here" color="indigo" radius="0" size={50} />
                    </Grid.Col>
                    <Grid.Col span={5} style={{ borderLeft: '1px solid #ccc', borderRadius: '4px' }}>
                        <Text><Text c="blue" fw={700}>Name:</Text>  {curr_user.email}</Text>
                    </Grid.Col>
                    <Grid.Col span={5} style={{ borderLeft: '1px solid #ccc', borderRadius: '4px' }}>
                        <Text><Text c="blue" fw={700}>Role:</Text>  {curr_user.role}</Text>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={6}>

                        <Space h="xl" />

                        <Title order={4} c="blue">User Permissions</Title>

                    </Grid.Col>
                    <Grid.Col span={6} >
                    <Space h="xl" />

                    <Title order={4} c="blue">User activity</Title>
                    <Space h="xl" />
                    <Timeline active={1} bulletSize={24} lineWidth={2}>
                        <Timeline.Item bullet={<IconGitBranch size={12} />} title="New branch">
                            <Text color="dimmed" size="sm">You&apos;ve created new branch <Text variant="link" component="span" inherit>fix-notifications</Text> from master</Text>
                            <Text size="xs" mt={4}>2 hours ago</Text>
                        </Timeline.Item>

                        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commits">
                            <Text color="dimmed" size="sm">You&apos;ve pushed 23 commits to<Text variant="link" component="span" inherit>fix-notifications branch</Text></Text>
                            <Text size="xs" mt={4}>52 minutes ago</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Pull request" bullet={<IconGitPullRequest size={12} />} lineVariant="dashed">
                            <Text color="dimmed" size="sm">You&apos;ve submitted a pull request<Text variant="link" component="span" inherit>Fix incorrect notification message (#187)</Text></Text>
                            <Text size="xs" mt={4}>34 minutes ago</Text>
                        </Timeline.Item>

                        <Timeline.Item title="Code review" bullet={<IconMessageDots size={12} />}>
                            <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Robert Gluesticker</Text> left a code review on your pull request</Text>
                            <Text size="xs" mt={4}>12 minutes ago</Text>
                        </Timeline.Item>
                    </Timeline>


                </Grid.Col>

 

                </Grid>





            </Modal>
        </>
    );
}

export default UserActionModal;
