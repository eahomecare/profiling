import { useMantineTheme, Button, Badge } from "@mantine/core";

const StyledBadge = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    root: {
      cursor: "pointer",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "#5C00F2",
      "&:hover": {
        backgroundImage:
          theme.colorScheme === "dark"
            ? theme.colors.teal[9]
            : "radial-gradient(#FFFFFF 1% ,#EBDFFF)",
        color: theme.colorScheme === "dark" ? theme.white : "#5C00F2",
        border: "1px solid #5C00F2",
      },
    },
  };

  return <Badge styles={{ ...defaultStyles, ...props.styles }} {...props} />;
};

export default StyledBadge;
