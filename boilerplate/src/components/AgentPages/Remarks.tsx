//@ts-nocheck
import { Text, Textarea } from '@mantine/core'
import React from 'react'

const Remarks = () => {
    return (
        <>
            <Textarea
                label={<Text fw={700}>Remarks</Text>}
                radius="md"
                variant='filled'
            />
        </>
    )
}

export default Remarks