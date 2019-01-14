import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import CUICard from "../../components/CustomMUI/CUICard";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { getBuyRate, getSellRate } from "../../actions/tradeActions";
import BuyHoldingsTable from "./BuyHoldingsTable";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import { getPortfolioSelector } from "../../selectors";

class BrokerDealerDashboard extends Component {
  componentWillMount() {
    const { first_name, email, phone, id, role, date, status, publicAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { getTokenBalance: fetchTokenBalance, getUserBalanceAction: fetchUserBalance } = this.props;
    const tokenOptions =
      JSON.parse(localStorage.getItem("user_data")).investors.map(x => ({
        key: x.name,
        value: x.address,
        text: x.name
      })) || [];
    this.setState({ first_name, email, phone, id, role, date, status, publicAddress, tokenOptions });
    for (const iterator of tokenOptions) {
      fetchTokenBalance(iterator.value);
      fetchUserBalance(iterator.value);
    }
  }

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  render() {
    const { dropDownSelect, tokenBalance, userBalance, currentPortfolioValue } = this.props || {};
    const { first_name, email, phone, id, role, date, status, publicAddress, tokenOptions } = this.state;
    return (
      <Grid container="true">
        <Navbar />
        <div style={{ marginTop: "100px" }}>
          <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
        </div>
        <CUICard style={{ marginTop: "10px", padding: "50px 50px" }}>
          <Row>
            <Col lg={8}>
              <div className="txt-m text--primary push--bottom push-top--35">
                Select Investor :{" "}
                <Dropdown className="txt-s" onChange={this.onDropdownChange} selection placeholder="Select Investor" options={tokenOptions} />
              </div>
              {dropDownSelect ? (
                <div>
                  <div className="txt-m text--primary push-half--bottom">
                    ETH Balance : <span className="txt-m text--secondary">{userBalance[dropDownSelect]}</span>
                  </div>
                  <div className="txt-m text--primary push-half--bottom">
                    Portfolio Value : <span className="txt-m text--secondary">{formatMoney(currentPortfolioValue[dropDownSelect].total, 0)}</span>
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>
        </CUICard>
        {dropDownSelect ? (
          <div>
            <BuyHoldingsTable
              publicAddress={publicAddress}
              dropDownSelect={dropDownSelect}
              currentPortfolioValue={currentPortfolioValue[dropDownSelect]}
            />
            <CUICard>
              <Row center="lg">
                <Col>
                  <TokenChart tokenBalance={tokenBalance[dropDownSelect]} />
                </Col>
              </Row>
            </CUICard>
          </div>
        ) : null}
      </Grid>
    );
  }
}

BrokerDealerDashboard.propTypes = {
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { marketMakerData, userData, tradeData, priceHistoryData } = state;
  const { userBalance, tokenBalance } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  const { buyTradeData, sellTradeData } = tradeData || {};
  const { priceHistory } = priceHistoryData || {};
  return {
    dropDownSelect,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state),
    userBalance,
    buyTradeData,
    sellTradeData,
    priceHistory
  };
};

export default connect(
  mapStateToProps,
  { onDropdownChange, getTokenBalance, getUserBalanceAction, getBuyRate, getSellRate }
)(BrokerDealerDashboard);
