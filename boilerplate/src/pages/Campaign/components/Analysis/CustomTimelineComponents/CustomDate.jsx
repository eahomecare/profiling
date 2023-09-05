import { ActionIcon, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

function CustomDate({ setSelectedDate }) {

    return (
        <DatePickerInput
            popoverProps={{ withinPortal: true }}
            rightSection={<ActionIcon variant="subtle"><IconCalendar size="1.1rem" stroke={1.5} /></ActionIcon>}
            label={<Text fw={'light'}>Date</Text>}
            placeholder={<Text>Select Date</Text>}
            onChange={(e) => setSelectedDate(e)}
            mx="auto"
            maw={400}
        />
    );
}

export default CustomDate