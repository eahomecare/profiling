import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Box, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Routes, Route, useNavigate } from "react-router-dom";
import Customers from "./pages/Customers/Customers";
import Register from "./pages/Login/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login/Login";
import SimulateCall from "./components/AgentPages/MobileSimulation";
import AgentEntry from "./components/AgentPages/AgentEntry";
import Acl from "./pages/Acl/Acl";
import PermissionDenied from "./pages/PermissionDenied";
import Analysis from "./pages/Campaign/components/Analysis/Analysis";
import { Notifications } from "@mantine/notifications";
import MainAppShell from "./AppShell/MainAppShell";
import BoardStats from "./pages/HomeDashBoard/BoardStats";
import Users from "./pages/Users/Users";
import MyAccount from "./AppShell/UserMenuItems/MyAccount/MyAccount";
import Security from "./AppShell/UserMenuItems/SecuritySettings/Security";
import Root from "./pages/Root/Root";
import { setAuth } from "./redux/authSlice";
import AllCampaigns from "./pages/Campaign/components/AllCampaigns/AllCampaigns";
// const Analysis = lazy(() =>
//   import("./pages/Campaign/components/Analysis/Analysis"),
// );
// const Customers = lazy(() => import("./pages/Customers/Customers"));
// const Acl = lazy(() => import("./pages/Acl/Acl"));

function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const {
    rolesPermissionsStatus,
    rolesPermissions,
    userPermissions,
    getAllRolesPermissionsMappingsByUserStatus,
  } = useSelector((state) => state.rolePermission);

  // if (getAllRolesPermissionsMappingsByUserStatus === "success")
  //   console.log(userPermissions,"--------------------MY PERMISSIONS");

  useEffect(() => {
    if ("login" in localStorage) {
      const login = JSON.parse(localStorage.getItem("login"));
      axios.defaults.headers.common["authorization"] = `Bearer ${login.token}`;
    }
  }, [isLoggedIn]);

  const navigate = useNavigate();

  function hasPermission(userPermissions, permissionName) {
    return userPermissions.some(
      (permission) => permission.name === permissionName,
    );
  }

  useEffect(() => {
    const { isLoggedIn } = JSON.parse(localStorage.getItem("login")) || {};
    if (isLoggedIn) {
      dispatch(setAuth());
    }
  }, [dispatch, isLoggedIn]);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <MainAppShell>
            <Routes>
              {/* {hasPermission(userPermissions, "user_view") ? (
                <PrivateRoute path="/" element={<BoardStats />} />
              ) : (
                <PrivateRoute path="/" element={<PermissionDenied />} />
              )} */}
              <PrivateRoute path="/" element={<Root />} />
              {hasPermission(userPermissions, "customer_dashboard") ? (
                <PrivateRoute path="/customers" element={<Customers />} />
              ) : (
                <PrivateRoute
                  path="/customers"
                  element={<PermissionDenied />}
                />
              )}
              <PrivateRoute path="/campaign" element={<Analysis />} />
              <PrivateRoute path="/myAccount" element={<MyAccount />} />
              <PrivateRoute path="/securitySettings" element={<Security />} />
              {hasPermission(userPermissions, "user_view") ? (
                <PrivateRoute path="/users" element={<Users />} />
              ) : (
                <PrivateRoute path="/users" element={<PermissionDenied />} />
              )}
              {hasPermission(userPermissions, "customer_dashboard") ? (
                <PrivateRoute path="/dashboard/*" element={<Dashboard />} />
              ) : (
                <PrivateRoute
                  path="/dashboard/*"
                  element={<PermissionDenied />}
                />
              )}
              {hasPermission(userPermissions, "acl") ? (
                <PrivateRoute path="/acl/*" element={<Acl />} />
              ) : (
                <PrivateRoute path="/acl/*" element={<PermissionDenied />} />
              )}
              {/* Agent specific routes not required */}
              <Route path="/mobileSimulation" element={<SimulateCall />} />
              <Route path="/agent" element={<AgentEntry />} />
            </Routes>
          </MainAppShell>
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
