import { ActionIcon } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

function CustomDate({ setSelectedDate }) {

    return (
        <DatePickerInput
            rightSection={<ActionIcon variant="subtle"><IconCalendar size="1.1rem" stroke={1.5} /></ActionIcon>}
            label="Pick date"
            placeholder="Select Date"
            onChange={(e) => setSelectedDate(e)}
            mx="auto"
            maw={400}
        />
    );
}

export default CustomDate