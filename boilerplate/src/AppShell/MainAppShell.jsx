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
  IconBell
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import LightDarkButton from "../components/LightDarkButton";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../components/assets/eaLogoRotate.svg";
import User from "./_user";
import { IconUserDollar } from "@tabler/icons-react";

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
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#0d5ff9",
    },
    "&:focus": {
      outline: "none",
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#0d5ff990",
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
      backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#0d5ff9",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
  stickyNavbar: {
    position: "sticky",
    height: "100%",
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

  //For Navbar entry
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 500);
  }, []);

  return (
    <>
      <Header
        styles={{
          root: {
            backgroundImage: "linear-gradient(#00239c,#0d5ff9)",
            paddingTop: 5,
            paddingRight: 20,
          },
        }}
        height={{ base: 50 }}
        withBorder={false}
      >
        <Flex justify={"flex-end"}>
          <Group>
            <LightDarkButton />
            <ActionIcon variant="subtle" c="white">
              <IconBell />
            </ActionIcon>
            <Avatar
              p={2}
              bg={"white"}
              // styles={{
              //   root: {
              //     backgroundImage: "radial-gradient(#FFFFFF 50% ,#0d5ff9)",
              //   },
              // }}
              size={"2.5rem"}
              radius="xl"
              src={Logo}
            />
          </Group>
        </Flex>
      </Header>
      <div style={{ display: "flex" }}>
        <Card
          shadow="md"
          w={"290px"}
          bg={theme.colorScheme == "dark" ? "" : "#FFFFFF"}
          sx={{
            //            boxShadow: `
            // rgba(13, 95, 249, 0.17) 0px -23px 25px 0px inset,
            // rgba(13, 95, 249, 0.15) 0px -36px 30px 0px inset,
            // rgba(13, 95, 249, 0.1) 0px -79px 40px 0px inset,
            // rgba(13, 95, 249, 0.06) 0px 2px 1px,
            // rgba(13, 95, 249, 0.09) 0px 4px 2px,
            // rgba(13, 95, 249, 0.09) 0px 8px 4px,
            // rgba(13, 95, 249, 0.09) 0px 16px 8px,
            // rgba(13, 95, 249, 0.09) 0px 32px 16px
            //    `,

            transform: isMounted ? "translateX(0%)" : "translateX(-100%)",
            transition: "transform 0.6s ease-out",
          }}
        >
          <Navbar
            className={classes.stickyNavbar}
            // height={"100vh"}
            p="xs"
            withBorder={false}
            bg={theme.colorScheme == "dark" ? "" : "transparent"}
          >
            <Space h={5} />
            <Navbar.Section>
              {users && user && user._id && (
                <User user={user} roleName={findUserRoleNameById(user._id)} />
              )}
            </Navbar.Section>
            <Space h={2} />
            <Stack>
              {hasPermission(userPermissions, "profile_dashboard") && (
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
                  to="/acl"
                  label="ACL"
                  icon={<IconSettingsAutomation size="2rem" stroke={2.0} />}
                  className={cx(classes.link, {
                    [classes.linkActive]: activeNavLink === "/acl",
                  })}
                >
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
                    to="/acl/rolesvspermissions"
                    label="Roles vs Permission"
                    icon={<IconSettings size="1rem" stroke={2} />}
                    className={classes.link}
                  />
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
                    to="/acl/permissions"
                    label="Permissions"
                    icon={<IconSettings size="1rem" stroke={2} />}
                    className={classes.link}
                  />
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
                    to="/acl/userpermissions"
                    label="Users Permissions"
                    icon={<IconSettings size="1rem" stroke={2} />}
                    className={classes.link}
                  />
                </NavLink>
              )}
              {hasPermission(userPermissions, "campaign_dashoard") && (
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


              {true && (
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
                  to="/profile"
                  label="Profiles"
                  icon={<IconUserDollar size="2rem" stroke={2} />}
                  className={cx(classes.link, {
                    [classes.linkActive]:
                      activeNavLink === "/profile" ||
                      activeNavLink === "/dashboard",
                  })}


                />
              )}
            </Stack>
          </Navbar>
        </Card>
        <span
          style={{
            flexGrow: "1",
            width: "100px",
            height: "calc(100vh - 50px)",
            overflowY: "auto",
            // backgroundColor: "#F8F8F8",
            backgroundImage: "radial-gradient(#F2F2F2 50% ,#F3F6FF)",
          }}
        >
          <div
            style={{
              paddingLeft: "10px",
              paddingRight: "20px",
              marginTop: "20px",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "transparent",
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
