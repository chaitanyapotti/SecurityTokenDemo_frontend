import React, { Component } from "react";
import { Table, Button, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { Grid } from "../../helpers/react-flexbox-grid";

class BrokerDealerDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  render() {
    const tokenOptions = [{ key: "Michelle", value: "Michelle", text: "Michelle" }, { key: "Christian", value: "Christian", text: "Christian" }];
    return (
      <Grid>
        <h2>Broker Dealer</h2>
        <div>
          Select Investor : <Dropdown onChange={this.onDropdownChange} selection placeholder="Select Investor" options={tokenOptions} />
        </div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
        <Button onClick={this.onLogoutClick}>Logout</Button>
      </Grid>
    );
  }
}

BrokerDealerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired
};

export default connect(
  null,
  { logoutUserAction }
)(BrokerDealerDashboard);
