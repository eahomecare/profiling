import { Avatar, Card, Center, Container, Divider, Grid, Group, RingProgress, Space, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import InfoTag from './InfoTag'

const PersonalInformation = ({ selectedCustomer }) => {
    const [profile, setProfile] = useState({ ...selectedCustomer.profiling.personal_details })
    const { profile_completion } = selectedCustomer
    const { source } = selectedCustomer

    const profileCompletion = (percentage) => {
        return (
            <div>
                <Center>
                    <RingProgress
                        mt={50}
                        size={80}
                        thickness={5}
                        sections={[{ value: percentage, color: (percentage > 75 ? '#1D9B25' : percentage > 60 ? '#CFA400' : '#D85972') }]}
                        label={
                            <Text color="" weight={20} align="center" size="xs">
                                {percentage}%
                            </Text>
                        }
                    />
                </Center>
            </div>
        )
    }
    return (
        <>
            <Container mt={-80}>
                <Group grow position='apart'>
                    <Text mt={70} fw={500}>Basic Details</Text>
                    <Space h={40} />
                    <div>
                        <Space h={40} />
                        {profileCompletion(profile_completion)}
                    </div>
                </Group>
                <div style={{ marginTop: '-30px' }}>
                    <InfoTag title={'Picture'} subject={<Avatar radius={'xl'} size='xl' />} />
                    <Grid gutter="xl" pt={'sm'}>
                        <Grid.Col span={4}>
                            <InfoTag title={'First Name'} subject={profile.full_name.split(' ')[0]} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InfoTag title={'Last Name'} subject={profile.full_name.split(' ')[1]} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InfoTag title={'Gender'} subject={profile.gender} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InfoTag title={'Date of birth'} subject={profile.dob} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InfoTag title={'Age'} subject={profile.age} />
                        </Grid.Col>
                    </Grid>
                    <Grid gutter="xl">
                        <Grid.Col span={4}>
                            <InfoTag title={'Marital Status'} subject={profile.marital_status} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InfoTag title={'Source'} subject={source} />
                        </Grid.Col>
                    </Grid>
                    <Divider my="md" size={'xs'} color={'#4E70EA'} />
                    <Text fw={500}>Contact Details</Text>
                    <Grid gutter="xl">
                        <Grid.Col span={6}>
                            <InfoTag title={'Email Address'} subject={profile.email} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Alternative Email'} subject={profile.alternate_email} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Mobile Number'} subject={profile.phone_number} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Alternative Mobile Number'} subject={profile.alternate_phone_number} />
                        </Grid.Col>
                    </Grid>
                    <Divider my="md" size={'xs'} color={'#4E70EA'} />
                    <Text fw={500}>Address</Text>
                    <Grid gutter="xl">
                        <Grid.Col span={6}>
                            <InfoTag title={'Location(city)'} subject={profile.location} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'State'} subject={profile.state} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'PINCODE'} subject={profile.pincode} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Country'} subject={profile.country} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Address Line'} subject={profile.address} />
                        </Grid.Col>
                    </Grid>
                </div>
            </Container>
        </>
    )
}

export default PersonalInformation