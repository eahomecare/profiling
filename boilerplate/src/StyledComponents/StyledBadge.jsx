import { useMantineTheme, Button, Badge } from "@mantine/core";

const StyledBadge = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    root: {
      cursor: "pointer",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "#2B1DFD",
      "&:hover": {
        backgroundImage:
          theme.colorScheme === "dark"
            ? theme.colors.teal[9]
            : "radial-gradient(#FFFFFF 1% ,#F3F6FF)",
        color: theme.colorScheme === "dark" ? theme.white : "#2B1DFD",
        border: "1px solid #2B1DFD",
      },
    },
  };

  return <Badge styles={{ ...defaultStyles, ...props.styles }} {...props} />;
};

export default StyledBadge;
