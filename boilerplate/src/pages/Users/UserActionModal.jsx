import { useDisclosure } from '@mantine/hooks';
import { Modal, useMantineTheme, Title, Button, SimpleGrid, Avatar, Text, Grid, Timeline, Space, ActionIcon, ScrollArea, Table } from '@mantine/core';
import { IconGitBranch, IconGitPullRequest, IconGitCommit, IconMessageDots, IconSettings } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


const UserActionModal = ({ isModalOpen, curr_user, handleModalClose, userRolesPermissions, classes, cx }) => {

    const initialData = Object.keys(userRolesPermissions).length > 0
    ? userRolesPermissions.map((data) => ({
        id: data.id,
        permission: data.permission.name,
        isactive: data.isActive ? "active" : "disabled",
        created_at: formatDate(data.created_at)
    }))
    : [];
    const theme = useMantineTheme();
    const [tableData, setTableData] = useState(initialData);
    const [scrolled, setScrolled] = useState(false);
    const [adding, setAdding] = useState(false);





    const rows = Array.isArray(tableData)
        ? tableData.map((row) => (
            <tr key={row.id}>
                <td>
                    {row.permission
                        ? row.permission
                        : <select>
                            <option value="">Select a permission</option>
                            {/* Add your options here */}
                        </select>}
                </td>
                <td><Switch checked={true} color='teal' onLabel="ACTIVE" offLabel="DISABLE" /></td>
                <td>{row.created_at}</td>
            </tr>
        ))
        : [];

    const addRow = () => {
        const newRow = {
            id: Math.random(), // generate a random id
            permission: '',
            isactive: "active",
            created_at: formatDate(new Date())
        };
        setTableData([...tableData, newRow]);
        setAdding(true);
    }

    const saveRow = () => {

    }
    return (
        <>
            {console.log(curr_user, userRolesPermissions)}
            <Modal
                opened={isModalOpen}
                title="User Actions"
                onClose={handleModalClose}
                overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 3,
                }}
                size={"auto"}


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
                    <Grid.Col span={8}>
                        <Space h="xl" />
                        <Title order={4} c="blue">User Permissions</Title>
                        <Space h="xl" />
                        <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                            <Table miw={300} striped withBorder highlightOnHover withColumnBorders>
                                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                    <tr>
                                        <th>Permission</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
                            <Space h="xl" />
                            {!adding && <Button onClick={addRow}>Add Permission</Button>}
                        {adding && <Button color='teal' onClick={saveRow}>Save</Button>}
                        </ScrollArea>
               
                    </Grid.Col>
                    <Grid.Col span={4} >
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
