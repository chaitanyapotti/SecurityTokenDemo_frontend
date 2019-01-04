import React, { Component } from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUserAction } from "./actions/authActions";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUserAction({}));
    window.location.href("/");
  }
}

//put header and footer here
class App extends Component {
  render() {
    const { children } = this.props || {};
    return <div className="App">{children}</div>;
  }
}

export default App;
