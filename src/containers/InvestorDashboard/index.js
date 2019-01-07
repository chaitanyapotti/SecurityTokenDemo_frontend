import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid } from "../../helpers/react-flexbox-grid";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";

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
    const { userBalance, tokenBalance, portfolioValue } = this.props || {};
    return (
      <Grid container>
        <h2>Investor</h2>
        <h3>ETH Balance : {userBalance} </h3>
        <h3>Portfolio Value : ${portfolioValue}</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(tokenBalance).map(key => (
              <Table.Row>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell>{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
              </Table.Row>
            ))}
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
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getUserBalanceAction, getTokenBalance }
)(InvestorDashboard);
