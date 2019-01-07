import React, { Component } from "react";
import { Table, Button, Dropdown, Card, CardContent, Feed } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import web3 from "../../helpers/web3";
import { Grid } from "../../helpers/react-flexbox-grid";
import CustomCard from "../../components/CustomMUI/CUICard";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";

class MarketMakerDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  componentDidMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    fetchUserBalance(localStorage.publicAddress);
    fetchTokenBalance(localStorage.publicAddress);
  }

  render() {
    const { userBalance, tokenBalance, portfolioValue, dropDownSelect } = this.props || {};
    const tokenOptions = [{ key: "LMD", value: "LMD", text: "LMD" }, { key: "RIV", value: "RIV", text: "RIV" }];
    return (
      <Grid>
        <h2>Market Maker</h2>

        <div>
          Select Token : <Dropdown onChange={this.onDropdownChange} selection placeholder="Select Token" options={tokenOptions} />
        </div>

        <HoldingsTable tokenBalance={tokenBalance} />
        <Button color="red" onClick={this.onLogoutClick}>
          Logout
        </Button>
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
