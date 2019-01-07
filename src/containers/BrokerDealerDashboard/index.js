import React, { Component } from "react";
import { Table, Button, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance } from "../../actions/userActions";
import { Grid } from "../../helpers/react-flexbox-grid";
import HoldingsTable from "../../components/common/HoldingsTable";

class BrokerDealerDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    const { getTokenBalance: fetchTokenBalance } = this.props || {};
    dropDownChange(d.value);
  };

  render() {
    const { dropDownSelect, tokenBalance } = this.props || {};
    console.log(tokenBalance);
    const tokenOptions = [{ key: "Michelle", value: "Michelle", text: "Michelle" }, { key: "Christian", value: "Christian", text: "Christian" }];
    return (
      <Grid>
        <h2>Broker Dealer</h2>
        <div>
          Select Investor : <Dropdown onChange={this.onDropdownChange} selection placeholder="Select Investor" options={tokenOptions} />
        </div>
        {dropDownSelect === "Michelle" ? (
          <HoldingsTable tokenBalance={tokenBalance} />
        ) : dropDownSelect === "Christian" ? (
          <HoldingsTable tokenBalance={tokenBalance} />
        ) : (
          <div />
        )}
        <Button color="red" onClick={this.onLogoutClick}>
          Logout
        </Button>
      </Grid>
    );
  }
}

BrokerDealerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { marketMakerData, userData } = state;
  const { tokenBalance } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  return {
    dropDownSelect,
    tokenBalance
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance }
)(BrokerDealerDashboard);
