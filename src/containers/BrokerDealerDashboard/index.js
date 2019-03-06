import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import CUICard from "../../components/CustomMUI/CUICard";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction, getTransactionHistory } from "../../actions/userActions";
import { getBuyRate, getSellRate } from "../../actions/tradeActions";
import BuyHoldingsTable from "./BuyHoldingsTable";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import Navbar from "../Navbar";
import { getPortfolioSelector, getTokenPortfolioSelector } from "../../selectors";
import PortfolioTable from "../../components/common/PortfolioTable";
import TransactionHistory from "../../components/common/TransactionHistory";
import DropdownComponent from "../../components/common/DropdownComponent";
import AddInvestorModal from "../../components/AddInvestorModal";

class BrokerDealerDashboard extends Component {
  componentDidMount() {
    const { publicAddress, investors } = this.props || {};
    const { getTokenBalance: fetchTokenBalance, getUserBalanceAction: fetchUserBalance, getTransactionHistory: fetchTransactionHistory } = this.props;

    const tokenOptions = investors.map(x => x.address) || [];
    for (const iterator of tokenOptions) {
      fetchTokenBalance(iterator);
      fetchUserBalance(iterator);
      fetchTransactionHistory(publicAddress, iterator);
    }
  }

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(e.target.value);
  };

  render() {
    const { dropDownSelect, tokenBalance, userBalance, currentPortfolioValue, currentHoldings, transactionHistory, publicAddress, tokenOptions } =
      this.props || {};
    const { modalOpen } = this.state;
    const dropDownSelectedPortfolio = currentPortfolioValue[dropDownSelect] || {};
    const { total } = dropDownSelectedPortfolio || {};
    return (
      <Grid container="true">
        <Navbar />
        <div className="txt-m text--black text-align push--bottom push-top--100 ">Portfolio Under Management</div>
        <PortfolioTable currentHoldings={currentHoldings} />
        <CUICard style={{ marginTop: "10px", padding: "50px 50px" }}>
          <Row>
            <Col lg={6}>
              <div className="txt-m text--primary push--bottom push-top--35">
                Select Investor :{" "}
                <DropdownComponent onChange={this.onDropdownChange} value={dropDownSelect} label="Select Investor" data={tokenOptions} />
              </div>
              {dropDownSelect ? (
                <div>
                  <div className="txt-m text--primary push-half--bottom">
                    ETH Balance : <span className="txt-m text--secondary">{userBalance[dropDownSelect]}</span>
                  </div>
                  <div className="txt-m text--primary push-half--bottom">
                    Portfolio Value : <span className="txt-m text--secondary">{formatMoney(total || 0, 0)}</span>
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>
        </CUICard>
        {dropDownSelect ? (
          <div>
            <BuyHoldingsTable publicAddress={publicAddress} dropDownSelect={dropDownSelect} currentPortfolioValue={dropDownSelectedPortfolio} />
            <TransactionHistory transactionHistory={transactionHistory} dropDownSelect={dropDownSelect} />
            <CUICard>
              <Row center="lg">
                <Col>
                  <TokenChart tokenBalance={tokenBalance[dropDownSelect]} />
                </Col>
              </Row>
            </CUICard>
          </div>
        ) : null}
        <AddInvestorModal modalOpen={modalOpen} handleClose={() => this.setState({ modalOpen: false })} />
      </Grid>
    );
  }
}

BrokerDealerDashboard.propTypes = {
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  getTransactionHistory: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { marketMakerData, userData, tradeData, priceHistoryData, auth } = state;
  const { userData: newData } = auth || {};
  const { userBalance, tokenBalance, transactionHistory } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  const { buyTradeData, sellTradeData } = tradeData || {};
  const { priceHistory } = priceHistoryData || {};
  const { publicAddress, investors } = newData;
  const tokenOptions =
    investors.map(x => ({
      value: x.address,
      text: x.name
    })) || [];
  return {
    publicAddress,
    investors,
    dropDownSelect,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state),
    currentHoldings: getTokenPortfolioSelector(state),
    userBalance,
    buyTradeData,
    sellTradeData,
    priceHistory,
    transactionHistory,
    tokenOptions
  };
};

export default connect(
  mapStateToProps,
  { onDropdownChange, getTokenBalance, getUserBalanceAction, getBuyRate, getSellRate, getTransactionHistory }
)(BrokerDealerDashboard);
