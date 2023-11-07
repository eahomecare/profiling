import { useMantineTheme, Button } from "@mantine/core";

const StyledButton = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    root: {
      width: "100%",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#0d5ff9",
      color: theme.colorScheme === "dark" ? theme.white : "white",
      "&:hover": {
        backgroundImage:
          theme.colorScheme === "dark"
            ? theme.colors.teal[9]
            : "radial-gradient(#FFFFFF 1% ,#F3F6FF)",
        color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
        border: "1px solid #0d5ff9",
      },
    },
  };

  return <Button styles={{ ...defaultStyles, ...props.styles }} {...props} />;
};

export default StyledButton;
