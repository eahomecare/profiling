import { createStyles, getStylesRef } from "@mantine/core";
import { NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import { cx } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    "&": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#EBDFFF",
      color: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#5C00F2",
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#5C00F2",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },
  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },
  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#5C00F2",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const StyledNavLink = ({ to, label, icon, isActive, subLinks = [] }) => {
  const { classes } = useStyles();

  return (
    <>
      <NavLink
        styles={{
          root: {
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(5px)",
            },
          },
        }}
        component={Link}
        to={to}
        label={label}
        icon={icon}
        className={cx(classes.link, {
          [classes.linkActive]: isActive,
        })}
      />
      {subLinks.length > 0 &&
        subLinks.map((subLink) => (
          <NavLink
            key={subLink.to}
            styles={{
              root: {
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(5px)",
                },
              },
            }}
            component={Link}
            to={subLink.to}
            label={subLink.label}
            icon={subLink.icon}
            className={cx(classes.link, {
              [classes.linkActive]: isActive,
            })}
          />
        ))}
    </>
  );
};

export default StyledNavLink;
