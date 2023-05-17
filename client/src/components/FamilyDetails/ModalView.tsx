import React, { ReactNode, useState } from "react";
import { Button, Modal, useMantineTheme, Text, Grid, Box, Divider, Center, Container } from "@mantine/core";
import { TableSelectionProps } from './FamilyDetails'; // import the TableSelectionProps type
import InfoTag from "../common/InfoTag";

interface MyModalProps<T extends Record<string, unknown>> {
    rowData: T;
}

function MyModal<T extends Record<string, unknown>>({ rowData }: MyModalProps<T>) {
    const [opened, setOpened] = useState(false);

    const handleClose = () => setOpened(false);
    const handleOpen = () => setOpened(true);

    return (
        <>
            <Text c={'#4E70EA'} style={{ cursor: 'pointer' }} onClick={handleOpen} size="sm">View</Text>
            <Modal opened={opened} onClose={handleClose}
                title={<Text mb={-20} fw={700}>{'Family Member Details'}</Text>}
                size={'lg'}
            >
                <Container>
                    <Divider my="md" size={'xs'} color={'#4E70EA'} />
                    <Grid gutter="md">
                        {Object.entries(rowData).map(([key, value]) => (
                            key !== 'id' && (
                                <Grid.Col span={6} key={key}>
                                    <InfoTag title={key} subject={value} />
                                </Grid.Col>
                            )
                        ))}
                        <Grid.Col span={6}>
                            <InfoTag title={'Age'} subject={'35'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Pan Card'} subject={'PANCARD'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Passport'} subject={'PASSPORT'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Aadhar Card'} subject={'AADHARCARD'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Voter Id'} subject={'VOTERID'} />
                        </Grid.Col>
                    </Grid>
                    <Center>
                        <Button mt="md" onClick={handleClose}>Okay</Button>
                    </Center>
                </Container>
            </Modal>
        </>
    );
}

export default MyModal;