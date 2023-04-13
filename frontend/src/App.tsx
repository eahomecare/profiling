
import Layout from "./components/Layout";
// import PrivateRoute from "./components/PrivateRoute";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setAuth } from "./redux/authSlice";


import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import { RootState } from "./redux/store";


function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state:RootState) => state.auth);


  return (
    <Routes>
      <>
      <Route path="/login">
       <Login/>
      </Route>
      </>
      
    </Routes>
  );
}

export default App;