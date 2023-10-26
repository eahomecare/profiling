import { useMantineTheme, TextInput } from "@mantine/core";

const StyledTextInput = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    rightSection: { pointerEvents: "none" },
    label: {
      color: "#2B1DFD99",
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
    <TextInput styles={{ ...defaultStyles, ...props.styles }} {...props} />
  );
};

export default StyledTextInput;
