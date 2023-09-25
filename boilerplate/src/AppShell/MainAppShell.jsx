import {
  Avatar,
  Flex,
  Group,
  Header,
  NavLink,
  Navbar,
  Space,
  Stack,
  Card,
  createStyles,
  useMantineTheme,
  getStylesRef,
  ActionIcon,
} from "@mantine/core";
import {
  Icon3dCubeSphere,
  IconUsersGroup,
  IconAccessible,
  IconSettingsAutomation,
  IconAnalyze,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import LightDarkButton from "../components/LightDarkButton";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../components/assets/eaLogoRotate.svg";
import User from "./_user";

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
    // padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#4E70EA",
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
      // backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#4E70EA",
      // color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const MainAppShell = ({ children }) => {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const [activeNavLink, setActiveNavLink] = useState("");
  const { user, users } = useSelector((state) => state.auth);
  const theme = useMantineTheme();

  const { userPermissions, getAllRolesPermissionsMappingsByUserStatus } =
    useSelector((state) => state.rolePermission);

  function hasPermission(userPermissions, permissionName) {
    return userPermissions.some(
      (permission) => permission.name === permissionName,
    );
  }

  function findUserRoleNameById(userId) {
    const user = users.find((user) => user.id === userId);

    if (user) {
      return user.role.name;
    } else {
      return "User not found";
    }
  }

  useEffect(() => {
    const pathname = location.pathname;
    setActiveNavLink(pathname);
  }, [location.pathname]);

  return (
    <>
      <Header height={{ base: 50 }} withBorder={false}>
        <Flex justify={"flex-end"}>
          <Group>
            <LightDarkButton />
            <ActionIcon variant="outline" color="#4E70EA">
              <IconBell />
            </ActionIcon>
            <Avatar radius="xl" src={Logo} />
          </Group>
        </Flex>
      </Header>
      <div style={{ display: "flex" }}>
        <span>
          <Card
            shadow="md"
            radius={"md"}
            bg={theme.colorScheme == "dark" ? "" : "#DDE5FF"}
          >
            <Navbar
              height={500}
              p="xs"
              withBorder={false}
              bg={theme.colorScheme == "dark" ? "" : "#DDE5FF"}
            >
              <Space h={5} />
              <Navbar.Section>
                <User user={user} roleName={findUserRoleNameById(user._id)} />
              </Navbar.Section>
              <Space h={2} />
              {/* <Stack>
                                {hasPermission(userPermissions, "customer_dashboard") && (
                                    <Link to="/" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/" })}>
                                        <NavLink
                                            label="Dashboard"
                                            icon={<IconAnalyze size="2rem" stroke={2} />}
                                        >
                                        </NavLink>
                                    </Link>
                                )}
                                {hasPermission(userPermissions, "user_view") && (
                                    <Link to="/users" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/users" })}>
                                        <NavLink
                                            label="Users"
                                            icon={<IconUsersGroup size="2rem" stroke={2} />}
                                            className={classes.link}
                                        >
                                        </NavLink>
                                    </Link>
                                )}

                                {hasPermission(userPermissions, "acl") && (
                                    <NavLink
                                        label="ACL"
                                        icon={<IconSettingsAutomation size="2rem" stroke={2.0} />}
                                        active={activeNavLink === "/acl"}
                                        className={classes.link}
                                    >
                                        <Link to="/acl/rolesvspermissions" style={{ textDecoration: "none" }}>
                                            <NavLink
                                                label="Roles vs Permission"
                                                icon={<IconSettings size="1rem" stroke={2} />}
                                                active={activeNavLink === "/acl/rolesvspermissions"}
                                                className={classes.link}
                                            >
                                            </NavLink>
                                        </Link>

                                        <Link to="/acl/permissions" style={{ textDecoration: "none" }}>
                                            <NavLink
                                                label="Permissions"
                                                icon={<IconSettings size="1rem" stroke={2} />}
                                                active={activeNavLink === "/acl/permissions"}
                                                className={classes.link}
                                            >
                                            </NavLink>
                                        </Link>

                                    </NavLink>
                                )}

                                {hasPermission(userPermissions, "campaign_dashoard") && (
                                    <Link to="/campaign" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/campaign" })}>
                                        <NavLink
                                            label="Campaign"
                                            icon={<Icon3dCubeSphere size="2rem" stroke={2} />}
                                            className={classes.link}
                                        >
                                        </NavLink>
                                    </Link>
                                )}

                                {hasPermission(userPermissions, "customer_dashboard") && (
                                    <Link to="/customers" className={cx(classes.link, { [classes.linkActive]: activeNavLink === "/customers" })}>
                                        <NavLink
                                            label="Customers"
                                            icon={<IconAccessible size="2rem" stroke={2} />}
                                            className={classes.link}
                                        >
                                        </NavLink>
                                    </Link>
                                )}
                            </Stack> */}
              <Stack>
                {hasPermission(userPermissions, "customer_dashboard") && (
                  <NavLink
                    component={Link}
                    to="/"
                    label="Dashboard"
                    icon={<IconAnalyze size="2rem" stroke={2} />}
                    className={cx(classes.link, {
                      [classes.linkActive]: activeNavLink === "/",
                    })}
                  />
                )}

                {hasPermission(userPermissions, "user_view") && (
                  <NavLink
                    component={Link}
                    to="/users"
                    label="Users"
                    icon={<IconUsersGroup size="2rem" stroke={2} />}
                    className={cx(classes.link, {
                      [classes.linkActive]: activeNavLink === "/users",
                    })}
                  />
                )}

                {hasPermission(userPermissions, "acl") && (
                  <NavLink
                    component={Link}
                    to="/acl"
                    label="ACL"
                    icon={<IconSettingsAutomation size="2rem" stroke={2.0} />}
                    className={cx(classes.link, {
                      [classes.linkActive]: activeNavLink === "/acl",
                    })}
                  >
                    <NavLink
                      component={Link}
                      to="/acl/rolesvspermissions"
                      label="Roles vs Permission"
                      icon={<IconSettings size="1rem" stroke={2} />}
                      className={classes.link}
                    />
                    <NavLink
                      component={Link}
                      to="/acl/permissions"
                      label="Permissions"
                      icon={<IconSettings size="1rem" stroke={2} />}
                      className={classes.link}
                    />
                  </NavLink>
                )}

                {hasPermission(userPermissions, "campaign_dashoard") && (
                  <NavLink
                    component={Link}
                    to="/campaign"
                    label="Campaign"
                    icon={<Icon3dCubeSphere size="2rem" stroke={2} />}
                    className={cx(classes.link, {
                      [classes.linkActive]: activeNavLink === "/campaign",
                    })}
                  />
                )}

                {hasPermission(userPermissions, "customer_dashboard") && (
                  <NavLink
                    component={Link}
                    to="/customers"
                    label="Customers"
                    icon={<IconAccessible size="2rem" stroke={2} />}
                    className={cx(classes.link, {
                      [classes.linkActive]:
                        activeNavLink === "/customers" ||
                        activeNavLink === "/dashboard",
                    })}
                  />
                )}
              </Stack>
            </Navbar>
          </Card>
        </span>
        <span style={{ flexGrow: "1", width: "100px" }}>
          <div style={{ paddingLeft: "10px" }}>
            {/* <div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                // marginBottom: "20px",
                // marginTop: "5px",
              }}
            ></div>
            {children}
          </div>
        </span>
      </div>
    </>
  );
};

export default MainAppShell;
