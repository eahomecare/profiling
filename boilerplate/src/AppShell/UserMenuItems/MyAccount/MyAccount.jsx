import { Box, Card, Grid, Title } from '@mantine/core'
import React from 'react'
import MyProfile from './MyProfile'
import EditProfile from './EditProfile'

const MyAccount = () => {
    return (
        <Box>
            <Card>
                <Title>
                    My Account
                </Title>
                <Grid grow>
                    <Grid.Col span={1}>
                        <MyProfile />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <EditProfile />
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    )
}

export default MyAccount