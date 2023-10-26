import { useMantineTheme, TextInput, PasswordInput } from "@mantine/core";

const StyledPasswordInput = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    visibilityToggle: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.teal[9] : "#2B1DFD99",
        color: theme.colorScheme === "dark" ? theme.white : "white",
      },
    },
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
    <PasswordInput styles={{ ...defaultStyles, ...props.styles }} {...props} />
  );
};

export default StyledPasswordInput;
