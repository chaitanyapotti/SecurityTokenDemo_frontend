import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid } from "../../helpers/react-flexbox-grid";

class InvestorDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  componentDidMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    fetchUserBalance(localStorage.publicAddress);
    fetchTokenBalance(localStorage.publicAddress);
  }

  render() {
    const { userData } = this.props || {};
    const { userBalance, tokenBalance } = userData;
    return (
      <Grid container>
        <h2>Investor</h2>
        <h3>ETH Balance : {Math.round(userBalance / Math.pow(10, 18))} </h3>
        <h3>Portfolio Value : {tokenBalance * 1 + tokenBalance * 10} ($USD)</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>LMD</Table.Cell>
              <Table.Cell>{tokenBalance}</Table.Cell>
              <Table.Cell>{tokenBalance * 1}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>RIV</Table.Cell>
              <Table.Cell>{tokenBalance}</Table.Cell>
              <Table.Cell>{tokenBalance * 10}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Button onClick={this.onLogoutClick}>Logout</Button>
      </Grid>
    );
  }
}

InvestorDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData } = state;
  return {
    userData
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getUserBalanceAction, getTokenBalance }
)(InvestorDashboard);
