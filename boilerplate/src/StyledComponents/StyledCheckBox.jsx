import { useMantineTheme, Button, Badge, Checkbox } from "@mantine/core";

const StyledCheckBox = (props) => {
  const theme = useMantineTheme();

  const defaultStyles = {
    input: {
      cursor: "pointer",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.teal[9] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.white : "#5C00F2",
      "&:hover": {
        border: "2px solid #5C00F2",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      },
    },
  };

  return (
    <Checkbox
      styles={{ ...defaultStyles, ...props.styles }}
      {...props}
      size={25}
      radius="xl"
      color={"grape"}
    />
  );
};

export default StyledCheckBox;
