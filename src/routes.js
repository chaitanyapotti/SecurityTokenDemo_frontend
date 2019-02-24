import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import ErrorBoundary from "./pages/ErrorBoundary";

const Login = lazy(() => import("./containers/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignUp = lazy(() => import("./pages/SignUp"));

export default (
  <ErrorBoundary>
    <Switch>
      <Route exact path="/" component={props => <Login {...props} />} />
      <Route exact path="/dashboard" component={props => <Dashboard {...props} />} />
      <Route exact path="/signup" component={props => <SignUp {...props} />} />
    </Switch>
  </ErrorBoundary>
);
