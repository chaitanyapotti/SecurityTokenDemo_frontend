import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import CUICard from "../../components/CustomMUI/CUICard";
import { getUserBalanceAction, getTokenBalance, getTransactionHistory } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "./HoldingsTable";
import Navbar from "../Navbar";
import { getPortfolioSelector } from "../../selectors";
import TransactionHistory from "../../components/common/TransactionHistory";

class InvestorDashboard extends Component {
  componentDidMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance, getTransactionHistory: fetchTransactionHistory } = this.props;
    const { publicAddress } = this.props || {};
    fetchUserBalance(publicAddress);
    fetchTokenBalance(publicAddress);
    fetchTransactionHistory(publicAddress, publicAddress);
  }

  render() {
    const {
      userBalance,
      tokenBalance,
      currentPortfolioValue,
      userLocalPublicAddress,
      buyTradeData,
      sellTradeData,
      buyButtonSpinning,
      buyButtonTransactionHash,
      buySuccess,
      sellButtonSpinning,
      sellButtonTransactionHash,
      sellSuccess,
      approveButtonSpinning,
      approveButtonTransactionHash,
      approveSuccess,
      transactionHistory
    } = this.props || {};
    const { publicAddress } = this.props || {};
    if (tokenBalance[publicAddress] && currentPortfolioValue[publicAddress]) {
      const isOperator = userLocalPublicAddress === publicAddress;
      return (
        <Grid container="true">
          <Navbar />
          <CUICard style={{ marginTop: "100px" }}>
            <Row>
              <Col lg={8}>
                <div className="txt-m text--primary push-half--bottom push-top--35">
                  ETH Balance : <span className="txt-m text--secondary">{userBalance[publicAddress]}</span>
                </div>
                <div className="txt-m text--primary push-half--bottom">
                  Portfolio Value : <span className="txt-m text--secondary">{formatMoney(currentPortfolioValue[publicAddress].total, 0)}</span>
                </div>
              </Col>
            </Row>
          </CUICard>
          <HoldingsTable
            isOperator={isOperator}
            tokenBalance={tokenBalance[publicAddress]}
            currentPortfolioValue={currentPortfolioValue[publicAddress]}
            buyTradeData={buyTradeData}
            sellTradeData={sellTradeData}
            buyButtonSpinning={buyButtonSpinning}
            buyButtonTransactionHash={buyButtonTransactionHash}
            buySuccess={buySuccess}
            sellButtonSpinning={sellButtonSpinning}
            sellButtonTransactionHash={sellButtonTransactionHash}
            sellSuccess={sellSuccess}
            approveSuccess={approveSuccess}
            approveButtonTransactionHash={approveButtonTransactionHash}
            approveButtonSpinning={approveButtonSpinning}
            userLocalPublicAddress={userLocalPublicAddress}
            publicAddress={publicAddress}
          />
          <div>
            <TransactionHistory transactionHistory={transactionHistory} dropDownSelect={publicAddress} />
          </div>
          <CUICard>
            <Row center="lg">
              <Col>
                <TokenChart tokenBalance={tokenBalance[publicAddress]} />
              </Col>
            </Row>
          </CUICard>
        </Grid>
      );
    }
    return (
      <div className="vertical-center">
        <CircularProgress />
      </div>
    );
  }
}

InvestorDashboard.propTypes = {
  getUserBalanceAction: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getTransactionHistory: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, auth, signinManagerData, tradeData } = state;
  const { userBalance, tokenBalance, transactionHistory } = userData || {};
  const {
    userData: { publicAddress }
  } = auth || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  const {
    buyTradeData,
    sellTradeData,
    buyButtonSpinning,
    buyButtonTransactionHash,
    sellButtonSpinning,
    sellButtonTransactionHash,
    buySuccess,
    sellSuccess,
    approveSuccess,
    approveButtonTransactionHash,
    approveButtonSpinning
  } = tradeData || {};
  return {
    publicAddress,
    userBalance,
    tokenBalance,
    userLocalPublicAddress,
    buyTradeData,
    sellTradeData,
    buyButtonSpinning,
    sellButtonSpinning,
    buyButtonTransactionHash,
    sellButtonTransactionHash,
    buySuccess,
    sellSuccess,
    approveSuccess,
    approveButtonTransactionHash,
    approveButtonSpinning,
    currentPortfolioValue: getPortfolioSelector(state),
    transactionHistory
  };
};

export default connect(
  mapStateToProps,
  { getUserBalanceAction, getTokenBalance, getTransactionHistory }
)(InvestorDashboard);
