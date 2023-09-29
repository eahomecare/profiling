import { ActionIcon, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import StyledDateInput from "../../../../../StyledComponents/StyledDateInput";

function CustomDate({ setSelectedDate }) {
  return (
    <StyledDateInput
      label={"Date"}
      placeholder={"Select Date"}
      onChange={(e) => setSelectedDate(e)}
      mx="auto"
      maw={400}
    />
  );
}

export default CustomDate;
