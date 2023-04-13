import React from "react";
import { useSelector } from "react-redux";
import { Redirect , Route } from "react-router-dom";
import { RootState } from "../redux/store";


export default function PrivateRoute({ path, ...props }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    return <Route path={path} {...props} />;
  } else {
    return <Redirect  to="/login" />;
  }
}
