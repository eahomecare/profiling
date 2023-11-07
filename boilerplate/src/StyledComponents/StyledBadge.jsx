import { useMantineTheme, Button, Badge } from "@mantine/core";

const StyledBadge = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    root: {
      cursor: "pointer",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
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

  return <Badge styles={{ ...defaultStyles, ...props.styles }} {...props} />;
};

export default StyledBadge;
