import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuth } from "./redux/authSlice";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Routes, Route, useNavigate } from "react-router-dom";
import Customers from "./pages/Customers/Customers";
import Register from "./pages/Login/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./ThemeProvider";
import Login from "./pages/Login/Login";
import SimulateCall from "./components/AgentPages/MobileSimulation";
import AgentEntry from "./components/AgentPages/AgentEntry";
import Acl from "./pages/Acl/Acl";
import PermissionDenied from "./pages/PermissionDenied";
import Analysis from "./pages/Campaign/components/Analysis/Analysis";

function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { rolesPermissionsStatus, rolesPermissions, userPermissions, getAllRolesPermissionsMappingsByUserStatus } = useSelector(state => state.rolePermission);

  if (getAllRolesPermissionsMappingsByUserStatus === "success") console.log(userPermissions);

  useEffect(() => {
    if ("login" in localStorage) {
      const login = JSON.parse(localStorage.getItem("login"));
      axios.defaults.headers.common["authorization"] = `Bearer ${login.token}`;
    }
  }, [isLoggedIn]);

  const navigate = useNavigate();

  function hasPermission(userPermissions, permissionName) {
    return userPermissions.some(permission => permission.name === permissionName);
  }

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {hasPermission(userPermissions, "customer dashboard") ? (
            <PrivateRoute path="/dashboard/*" element={<Dashboard />} />
          ) : (
            <PrivateRoute path="/dashboard/*" element={<PermissionDenied />} />
          )}
          {hasPermission(userPermissions, "user view") ? (
            <PrivateRoute path="/" element={<Customers />} />
          ) : (
            <PrivateRoute path="/" element={<PermissionDenied />} />
          )}
          {hasPermission(userPermissions, "acl") ? (
            <PrivateRoute path="/acl" element={<Acl />} />
          ) : (
            <PrivateRoute path="/acl" element={<PermissionDenied />} />
          )}
          <Route path="/campaign" element={<Analysis />} />
          <Route path="/mobileSimulation" element={<SimulateCall />} />
          <Route path="/agent" element={<AgentEntry />} />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;


