import React from "react";
import { Redirect, useLocation, Route } from "react-router-dom";

// @ts-ignore: Unreachable code error
const RequireAuth = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem("token") ? true : false;
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname },
            }}
          />
        )
      }
    />
  );
};

export default RequireAuth;
