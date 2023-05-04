import React from 'react'
import BMISpeedometer from './BMImeter'
import { Box, Flex, Grid, Text } from '@mantine/core'
import InfoTag from '../common/InfoTag'
import Allergies from './Allergies'

const Health = () => {
    return (
        <>
            <Box p={10}>
                <Text>Health Details</Text>
                <Flex>
                    <Grid gutter="xl" pt={'sm'}>
                        <Grid.Col span={6}>
                            <InfoTag title={'First Name'} subject={'Elon'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Last Name'} subject={'Musk'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Date of birth'} subject={'Musk'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Gender'} subject={'Male'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Height'} subject={'170 cm [5"7\']'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Weight'} subject={'78 kgs'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'BMI'} subject={'12(Overweight)'} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InfoTag title={'Blood Group'} subject={'B+'} />
                        </Grid.Col>
                    </Grid>
                    <BMISpeedometer bmi={12} />
                </Flex>
                <Box mt={10}>
                    <Allergies />
                </Box>
            </Box>
        </>
    )
}

export default Health