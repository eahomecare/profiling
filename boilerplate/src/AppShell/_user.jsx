import React, { useState } from "react";
import {
  createStyles,
  useMantineTheme,
  getStylesRef,
  NavLink,
  UnstyledButton,
  Group,
  Avatar,
  Box,
  Text,
  rem,
  Card,
  Navbar,
  Menu,
  Stack,
  Flex,
} from "@mantine/core";
import {
  IconChevronRight,
  IconChevronLeft,
  IconUser,
  IconKey,
  IconBell,
  IconLogout,
  IconTrash,
  IconChevronDown,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { clearUserPermissions } from "../redux/rolesPermissionSlice";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : "#0d5ff9",
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#0d5ff9",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
    },

    //   For Dark Mode
    //   "&": {
    //     backgroundColor:
    //       theme.colorScheme === "dark" ? theme.colors.dark[6] : "transparent",
    //     color: theme.colorScheme === "dark" ? theme.white : "white",
    //   },
    //   "&:hover": {
    //     backgroundColor:
    //       theme.colorScheme === "dark" ? theme.colors.dark[6] : "transparent",
    //     backgroundImage: "radial-gradient(#FFFFFF 1% ,#FFFFFF00)",
    //     color: theme.colorScheme === "dark" ? theme.white : "#0d5ff9",
    //     width: "110%",
    //   },
    // },
    //
    // linkActive: {
    //   "&, &:hover": {
    //     backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#F3F6FF",
    //     color: theme.colorScheme === "dark" ? theme.white : "#F3F6FF",
    //     [`& .${getStylesRef("icon")}`]: {
    //       color: theme.fn.variant({ variant: "light", color: "#F3F6FF" }).color,
    //     },
    //   },
  },
}));



const User = ({ user, roleName }) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUserPermissions())
  }

  return (
    <div>
      <Menu
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        styles={{
          dropdown: {
            border: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <Menu.Target>
          <UnstyledButton
            // onClick={() => setOpened(prev => !prev)}
            sx={{
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              // boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              // boxShadow:
              //   "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              color:
                theme.colorScheme === "dark" ? theme.colors.dark[0] : "#0d5ff9",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : "transparent",
                border: "none",
              },
            }}
          >
            <Flex justify={"space-between"}>
              <Avatar
                src={
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                }
                radius="xl"
              />
              <Group>
                <Stack spacing={0}>
                  <Text size="sm" weight={500}>
                    {user?.email?.split("@")[0]}
                  </Text>
                  <Text color="#0d5ff9" size="xs">
                    {roleName}
                  </Text>
                </Stack>
                <IconChevronDown size={rem(18)} />
              </Group>
            </Flex>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Box>
            <Card
              bg={"#F3F6FF"}
              shadow="xl"
              radius={"md"}
              sx={{ border: "1px solid #0d5ff9" }}
            >
              <NavLink
                component={Link}
                to="/myAccount"
                label="My Account"
                icon={<IconUser size={14} />}
                className={cx(classes.link, classes.linkIcon)}
              />
              <NavLink
                component={Link}
                to="/securitySettings"
                label="Change Password"
                icon={<IconKey size={14} />}
                className={cx(classes.link, classes.linkIcon)}
              />
              <NavLink
                component="div"
                label="Logout"
                color="red"
                icon={<IconLogout size={14} />}
                className={cx(classes.link, classes.linkIcon)}
                onClick={() => handleLogout()}
              />
            </Card>
          </Box>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default User;
