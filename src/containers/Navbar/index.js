import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { Button, AppBar } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { logoutUserAction } from "../../actions/authActions";

class Navbar extends PureComponent {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  render() {
    const { isAuthenticated } = this.props || {};
    return (
      <AppBar className="bg-test">
        <Grid>
          <Row>
            <Col lg={10} sm={6}>
              <img src="/assets/TWO12BlkWht.png" alt="whitelist checked" width="105" height="45" />
            </Col>
            <Col lg={2} sm={6}>
              <span>
                {isAuthenticated && (
                  <Button className="btn bg--danger txt-p-vault txt-dddbld text--white push-half-h--top" onClick={this.onLogoutClick}>
                    Logout
                  </Button>
                )}
              </span>
              <span className="push--left push--top">v0.9</span>
            </Col>
          </Row>
        </Grid>
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
