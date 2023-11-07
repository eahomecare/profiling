import { ActionIcon, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const StyledDateInput = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    rightSection: { pointerEvents: "none", color: "#0d5ff9" },
    label: {
      color: "#0d5ff999",
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
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#0d5ff9",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    monthList: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#0d5ff9",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    weekday: {
      color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
    },
    calendarHeaderLevel: {
      backgroundColor: "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#0d5ff9",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
    calendarHeaderControlIcon: {
      color: "#0d5ff9",
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
          <IconCalendar color={"#0d5ff9"} />
        </ActionIcon>
      }
    />
  );
};

export default StyledDateInput;
