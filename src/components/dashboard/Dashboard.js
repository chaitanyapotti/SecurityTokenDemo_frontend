import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    const { logoutUserAction: logoutUser, history } = this.props || {};
    logoutUser(history);
  };

  render() {
    return (
      <div>
        <Button color="teal" onClick={this.onLogoutClick}>
          Logout
        </Button>
      </div>
    );
  }
}

Dashboard.proptypes = {
  logoutUserAction: Proptypes.func.isRequired
};

export default connect(
  null,
  { logoutUserAction }
)(Dashboard);
