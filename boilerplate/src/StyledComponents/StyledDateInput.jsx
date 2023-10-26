import { ActionIcon, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const StyledDateInput = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    rightSection: { pointerEvents: "none", color: "#2B1DFD" },
    label: {
      color: "#2B1DFD99",
    },
    dropdown: {
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
    calendarHeader: {
      backgroundColor: "#F3F6FF",
    },
    day: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#2B1DFD",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    monthList: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#2B1DFD",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    weekday: {
      color: theme.colorScheme === "dark" ? theme.white : "#2B1DFD",
    },
    calendarHeaderLevel: {
      backgroundColor: "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "#2B1DFD",
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#2B1DFD",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    calendarHeaderControlIcon: {
      color: "#2B1DFD",
    },
    input: {
      cursor: "pointer",
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
  };

  return (
    <DateInput
      styles={{ ...defaultStyles, ...props.styles }}
      {...props}
      valueFormat={"DD MMM YYYY"}
      popoverProps={{ withinPortal: true }}
      rightSection={
        <ActionIcon>
          <IconCalendar color={"#2B1DFD"} />
        </ActionIcon>
      }
    />
  );
};

export default StyledDateInput;
