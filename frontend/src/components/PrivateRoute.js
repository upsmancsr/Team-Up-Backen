import React from "react";
import { Route, Redirect } from "react-router-dom";
import SignIn from './auth/SignIn';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
        <Component {...props} {...rest}/>
      ) : (
        // <Redirect to="/login" />
        <SignIn />
      )
    }
  />
);


export default PrivateRoute;