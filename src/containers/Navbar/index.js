import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { AppBar, Button, Menu, MenuItem, Toolbar } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { withRouter, Link } from "react-router-dom";
import { logoutUserAction } from "../../actions/authActions";

class Navbar extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { pathname }
    } = this.props || {};
    this.state = {
      menuOpen: false,
      anchorEl: null,
      pathname
    };
  }

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
    history.push(this.getMenuRoute());
  };

  getMenuRoute = () => {
    const { pathname } = this.state;
    return pathname === "/dashboard" ? "/profile" : "/dashboard";
  };

  render() {
    const { isAuthenticated, first_name } = this.props || {};
    const { menuOpen, anchorEl } = this.state;
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar className="bg-test">
          <Toolbar>
            <Link to="/dashboard">
              <img src="/assets/TWO12BlkWht.png" alt="whitelist checked" width="105" height="45" />
            </Link>
            <div style={{ flexGrow: 1 }} />
            {isAuthenticated && (
              <div>
                <Button onClick={this.handleOpen} color="inherit" aria-owns={menuOpen ? "menu-appbar" : undefined} aria-haspopup="true">
                  <div>
                    <AccountCircle />
                    <span style={{ position: "relative", top: "-5px", textTransform: "capitalize" }} className="push-half--left txt-m text-align">
                      {first_name}
                    </span>
                  </div>
                </Button>
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
                  <MenuItem className="txt-capitalize" onClick={this.onProfileClicked}>
                    {this.getMenuRoute().replace("/", "")}
                  </MenuItem>
                  <MenuItem onClick={this.onLogoutClick}>Logout</MenuItem>
                </Menu>
                <span className="push--left txt-m">v0.9</span>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUserAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { auth } = state;
  const {
    isAuthenticated,
    userData: { first_name }
  } = auth;
  return {
    first_name,
    isAuthenticated
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUserAction }
  )(Navbar)
);
