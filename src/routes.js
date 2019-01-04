import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

export default (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route exact path="/dashboard" component={Dashboard} />
  </Switch>
);
