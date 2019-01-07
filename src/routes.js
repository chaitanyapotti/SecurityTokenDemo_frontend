import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./containers/Login";
import Dashboard from "./pages/Dashboard";

export default (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route exact path="/dashboard" component={Dashboard} />
  </Switch>
);
