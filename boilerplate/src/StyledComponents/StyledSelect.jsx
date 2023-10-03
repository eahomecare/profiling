import { Select, Text, ActionIcon, useMantineTheme } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

const StyledSelect = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    rightSection: { pointerEvents: "none" },
    label: {
      color: "#5C00F299",
    },
    dropdown: {
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
    input: {
      cursor: "pointer",
      border: "none",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "black",
    },
    item: {
      "&": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
        color: theme.colorScheme === "dark" ? theme.white : "black",
      },
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#5C00F299",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
      "&[data-selected]": {
        "&, &:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.teal[9] : "#5C00F299",
          color: theme.colorScheme === "dark" ? theme.white : "white",
        },
      },
    },
  };

  return (
    <Select
      {...props}
      withinPortal
      transitionProps={{
        transition: "scale-y",
        duration: 500,
        timingFunction: "ease",
      }}
      styles={{ ...defaultStyles, ...props.styles }}
      rightSection={
        props.rightSection || (
          <ActionIcon c="#5C00F2" size={"sm"}>
            <IconChevronDown />
          </ActionIcon>
        )
      }
    />
  );
};

export default StyledSelect;
