import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import CUICard from "../../components/CustomMUI/CUICard";
import { logoutUserAction } from "../../actions/authActions";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";

class InvestorDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    console.log(history);
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
      <Grid container="true">
        <CUICard>
          <Row>
            <Col lg={6} xs={12}>
              <div className="txt-m text--primary push-half-h--bottom">
                Role : <span className="txt-m text--secondary">Investor</span>
              </div>
              <div className="txt-m text--primary push-half-h--bottom">
                ETH Balance : <span className="txt-m text--secondary">{userBalance}</span>
              </div>
              <div className="txt-m text--primary push-half-h--bottom">
                Portfolio Value : <span className="txt-m text--secondary">{formatMoney(portfolioValue, 0)}</span>
              </div>
            </Col>
          </Row>
        </CUICard>
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
              <Table.Row key={key}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell>{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <TokenChart tokenBalance={tokenBalance} />
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
