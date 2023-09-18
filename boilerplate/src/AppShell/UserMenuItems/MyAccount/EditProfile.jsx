import { Box, Card, Grid } from '@mantine/core';
import React, { useState } from 'react';
import ChangePassword from './ChangePassword';
import PasswordConstraints from './PasswordConstraints';

const Security = () => {
    const [password, setPassword] = useState('');

    return (
        <Box>
            <Card>
                <Grid grow>
                    <Grid.Col span={3}>
                        <ChangePassword onPasswordChange={setPassword} />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <PasswordConstraints password={password} />
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    )
}

export default Security;