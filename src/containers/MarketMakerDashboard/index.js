import React, { Component } from "react";
import { Table, Button, Dropdown, Card, CardContent, Feed } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import web3 from "../../helpers/web3";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";

class MarketMakerDashboard extends Component {
  constructor(props) {
    super(props);
    this.tokenOptions =
      Object.keys(config.tokens).map(x => ({
        key: config.tokens[x].name,
        value: config.tokens[x].address,
        text: config.tokens[x].name
      })) || {};

    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    console.log(reserveAddress);
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
  }

  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  render() {
    const { userBalance, tokenBalance, portfolioValue, dropDownSelect } = this.props || {};
    return (
      <Grid>
        <h2>Market Maker</h2>

        <div>
          Select Token : <Dropdown onChange={this.onDropdownChange} selection placeholder="Select Token" options={this.tokenOptions} />
        </div>

        <HoldingsTable tokenBalance={tokenBalance} />
        <Button color="red" onClick={this.onLogoutClick}>
          Logout
        </Button>
        <CUICard>
          <Row center="lg">
            <Col>
              <TokenChart tokenBalance={tokenBalance} />
            </Col>
          </Row>
        </CUICard>
      </Grid>
    );
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData } = state;
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue,
    dropDownSelect
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance, getUserBalanceAction }
)(MarketMakerDashboard);
