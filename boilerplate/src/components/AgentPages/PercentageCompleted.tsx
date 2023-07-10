import { Center, RingProgress, Stack, Text } from '@mantine/core'
import React from 'react'

const PercentageCompleted = ({ percentage }: { percentage: number }) => {
    return (
        <div>
            <Stack>
                <Text fw={550} size={15}>Profile Completion</Text>
                <Center mb={20}>
                    <RingProgress
                        size={70}
                        thickness={5}
                        sections={[{ value: percentage, color: (percentage > 75 ? '#1D9B25' : percentage > 60 ? '#CFA400' : '#D85972') }]}
                        label={
                            <Text color="" weight={20} align="center" size="xs">
                                {percentage}%
                            </Text>
                        }
                    />
                </Center>
            </Stack>
        </div>
    )
}

export default PercentageCompleted