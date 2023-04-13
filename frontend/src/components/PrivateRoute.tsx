import React from "react";
import { useSelector } from "react-redux";
import { Navigate , Route } from "react-router-dom";
import { RootState } from "../redux/store";

interface PrivateRouteProps {
  path: string;
  [key: string]: any;
}

export default function PrivateRoute({ path, ...props }: PrivateRouteProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  if (isLoggedIn) {
    return <Route path={path} {...props} />;
  } else {
    return <Navigate  to="/login" />;
  }
}
