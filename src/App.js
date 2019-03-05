import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { setCurrentUser, logoutUserAction, setUserData } from "./actions/authActions";
import SigninManager from "./containers/SigninManager";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const userData = localStorage.getItem("user_data") || {};
  store.dispatch(setUserData(userData));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUserAction({}));
    window.location.href("/");
  }
}

// put header and footer here
class App extends PureComponent {
  render() {
    const { children } = this.props || {};
    return (
      <div className="App">
        {children}
        <SigninManager />
      </div>
    );
  }
}

export default withRouter(App);
