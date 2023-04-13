import Login from "./pages/Login/Login";
import Layout from "./components/Layout";
import { Profile } from "./pages/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { Route, Switch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import axios from "axios";
import { setAuth } from "./redux/authSlice";
import { ThemeProvider } from "./ThemeProvider";
import Register from "./pages/Login/Register";
import Customers from "./pages/Customers/Customers";
import { ColorScheme, ColorSchemeProvider, MantineProvider, Paper, Transition } from '@mantine/core'
import { Notifications } from '@mantine/notifications'



function App() {
  const [colorScheme, setColorScheme] = useState('light');
  const toggleColorScheme = (value) =>
  setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if ("login" in localStorage) {
      const login = JSON.parse(localStorage.getItem("login"));
      axios.defaults.headers.common["authorization"] = `Bearer ${login.token}`;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const { isLoggedIn } = JSON.parse(localStorage.getItem("login")) || {};
    if (isLoggedIn) {
      dispatch(setAuth({ isLoggedIn }));
    }
  }, [dispatch, isLoggedIn]);
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Switch>
        <PrivateRoute exact path="/profile/:id">
          <Layout>
            <Profile />
          </Layout>
        </PrivateRoute>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/customers">
          <Customers/>
        </Route>
      </Switch>
      </MantineProvider>
    </ColorSchemeProvider>
    
  );
}

export default App;
