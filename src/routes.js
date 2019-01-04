import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";

export default (
  <Switch>
    <Route path="/" component={Login} />
  </Switch>
);
