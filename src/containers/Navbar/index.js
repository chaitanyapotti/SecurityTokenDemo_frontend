import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { Button, AppBar, IconButton, Menu, MenuItem, Toolbar } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { logoutUserAction } from "../../actions/authActions";

class Navbar extends PureComponent {
  state = {
    menuOpen: false,
    anchorEl: null
  };

  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    this.handleClose();
    logoutUser(history);
  };

  handleClose = () => {
    this.setState({ menuOpen: false });
  };

  handleOpen = event => {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget });
  };

  onProfileClicked = e => {
    const { history } = this.props || {};
    this.handleClose();
    history.push("/profile");
  };

  render() {
    const { isAuthenticated } = this.props || {};
    const { menuOpen, anchorEl } = this.state;
    return (
      <AppBar className="bg-test">
        <Toolbar>
          <img src="/assets/TWO12BlkWht.png" alt="whitelist checked" width="105" height="45" />
          <div style={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <div>
              <IconButton onClick={this.handleOpen} color="inherit" aria-owns={menuOpen ? "menu-appbar" : undefined} aria-haspopup="true">
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={menuOpen}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.onProfileClicked}>Profile</MenuItem>
                <MenuItem onClick={this.onLogoutClick}>Logout</MenuItem>
              </Menu>
              <span className="push--left">v0.9</span>
            </div>
          )}
        </Toolbar>
      </AppBar>
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
