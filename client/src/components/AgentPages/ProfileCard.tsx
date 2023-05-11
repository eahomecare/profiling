import { Box, Text, TextInput, Col, Grid } from '@mantine/core'
import React from 'react'

interface ProfileDetails {
    name: string;
    email: string;
    mobileNo: string;
    source: string;
    city: string;
}

interface ProfileCardProps {
    details: ProfileDetails;
    onDetailChange?: (key: keyof ProfileDetails, value: string) => void;
    editable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ details, onDetailChange, editable }) => {
    return (
        <Box>
            {Object.entries(details).map(([key, value]) => (
                <Grid key={key} gutter="5" justify="start" align="center">
                    <Col span={3}>
                        <Text fw={550} size={12}>{key.replace(/^\w/, c => c.toUpperCase())}</Text>
                    </Col>
                    <Col span={1}>
                        <Text>:</Text>
                    </Col>
                    <Col span={8}>
                        {editable && key !== 'mobileNo' ? (
                            <TextInput
                                size='12'
                                sx={{
                                    input: {
                                        backgroundColor: '#F1F5F9',
                                        border: 0
                                    },
                                }}
                                fz={'sm'}
                                c={'dimmed'}
                                value={value}
                                onChange={(event) => onDetailChange && onDetailChange(key as keyof ProfileDetails, event.currentTarget.value)}
                            />
                        ) : (
                            <Text fz={'sm'} c='dimmed'>{value}</Text>
                        )}
                    </Col>
                </Grid>
            ))}
        </Box>
    );
};

export default ProfileCard;