import { ActionIcon, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const StyledDateInput = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    rightSection: { pointerEvents: "none", color: "#5C00F2" },
    label: {
      color: "#5C00F299",
    },
    dropdown: {
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
    calendarHeader: {
      backgroundColor: "#EBDFFF",
    },
    day: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#5C00F2",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    monthList: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#5C00F2",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    weekday: {
      color: theme.colorScheme === "dark" ? theme.white : "#5C00F2",
    },
    calendarHeaderLevel: {
      backgroundColor: "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "#5C00F2",
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#5C00F2",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    calendarHeaderControlIcon: {
      color: "#5C00F2",
    },
    input: {
      cursor: "pointer",
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
  };

  return (
    <DateInput
      styles={{ ...defaultStyles, ...props.styles }}
      {...props}
      rightSection={
        <ActionIcon>
          <IconCalendar color={"#5C00F2"} />
        </ActionIcon>
      }
    />
  );
};

export default StyledDateInput;
