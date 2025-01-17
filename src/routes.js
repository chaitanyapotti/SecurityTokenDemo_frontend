import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import ErrorBoundary from "./pages/ErrorBoundary";

const Login = lazy(() => import("./containers/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));

export default (
  <ErrorBoundary>
    <Switch>
      <Route exact path="/" component={props => <Login {...props} />} />
      <Route exact path="/dashboard" component={props => <Dashboard {...props} />} />
      <Route exact path="/signup" component={props => <SignUp {...props} />} />
      <Route exact path="/profile" component={props => <Profile {...props} />} />
    </Switch>
  </ErrorBoundary>
);
