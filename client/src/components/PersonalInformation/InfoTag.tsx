import { Text } from '@mantine/core'
import React from 'react'

const InfoTag = ({ title, subject }: any) => {
    return (
        <>
            <Text fz={'sm'} c='dimmed'>{title}</Text>
            <Text>{subject}</Text>
        </>
    )
}

export default InfoTag