import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";

class MarketMakerDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  addTableRowsDynamically() {
    return (
      <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
      </Table.Row>
    );
  }

  render() {
    return (
      <div>
        <h2>Market Maker</h2>
        <br />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.addTableRowsDynamically()}</Table.Body>
        </Table>
        <Button onClick={this.onLogoutClick}>Logout</Button>
      </div>
    );
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired
};

export default connect(
  null,
  { logoutUserAction }
)(MarketMakerDashboard);
