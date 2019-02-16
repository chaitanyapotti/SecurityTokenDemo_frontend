import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  Button,
  Avatar,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Checkbox,
  Input,
  InputLabel,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import { logoutUserAction } from "../../actions/authActions";

class Navbar extends PureComponent {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  render() {
    const { isAuthenticated, add, modalOpen } = this.props || {};
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-test mb-4 fixed-top">
        <div className="container">
          <img src="/assets/TWO12BlkWht.png" alt="whitelist checked" width="105" height="45" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
            <span className="navbar-toggler-icon" />
          </button>
          {isAuthenticated ? (
            <div className="collapse navbar-collapse" id="mobile-nav">
              <ul className="nav nav-pills ml-auto">
                {add === "true" ? (
                  <li className="nav-item" style={{ marginRight: "20px" }}>
                    <Button onClick={modalOpen} variant="contained" color="primary">
                      {" "}
                      Add Investor
                    </Button>
                  </li>
                ) : (
                  <div />
                )}
                <li className="nav-item">
                  <Button className="btn bg--danger txt-p-vault txt-dddbld text--white" onClick={this.onLogoutClick}>
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          ) : (
            <div />
          )}
          <div className="push--left">v0.9</div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUserAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { auth } = state;
  const { isAuthenticated } = auth;
  return {
    isAuthenticated
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUserAction }
  )(Navbar)
);
