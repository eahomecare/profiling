import { useEffect, useRef, useState } from "react";
import { TimeInput } from '@mantine/dates'
import { ActionIcon, Text, rem } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

function CustomTime({ setSelectedTime }) {
    const ref = useRef(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    return (
        <TimeInput
            placeholder="Select Time"
            label={<Text fw={'light'}>Time</Text>}
            ref={ref}
            rightSection={pickerControl}
            onChange={(e) => setSelectedTime(e.target.value)} />
    );
}

export default CustomTime
