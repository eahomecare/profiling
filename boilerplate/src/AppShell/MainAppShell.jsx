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
      backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#4E70EA",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
  stickyNavbar: {
    position: "sticky",
    top: 0,
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
      <Header bg={"#4E70EA"} height={{ base: 50 }} withBorder={false}>
        <Flex justify={"flex-end"}>
          <Group>
            <LightDarkButton />
            <ActionIcon variant="filled" color="white">
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
              className={classes.stickyNavbar}
              // height={"100vh"}
              p="xs"
              withBorder={false}
              bg={theme.colorScheme == "dark" ? "" : "#DDE5FF"}
            >
              <Space h={5} />
              <Navbar.Section>
                <User user={user} roleName={findUserRoleNameById(user._id)} />
              </Navbar.Section>
              <Space h={2} />
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
        <span
          style={{
            flexGrow: "1",
            width: "100px",
            height: "calc(100vh - 50px)",
            overflowY: "auto",
          }}
        >
          <div style={{ paddingLeft: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
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
