import React, { Component } from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import LoadingButton from "../../components/common/LoadingButton";
import { onDropdownChange, depositEther, setCompactData, setQtyStepFunction, withdrawEther } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { getBuyRate, getSellRate } from "../../actions/tradeActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import RegularReserveTable from "./RegularReserveTable";
import AutomatedReserveTable from "./AutomatedReserveTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";
import { formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import Navbar from "../Navbar";
import AlertModal from "../../components/common/AlertModal";
import { CustomToolTip, Transaction } from "../../components/common/FormComponents";
import { getPortfolioSelector } from "../../selectors";

class MarketMakerDashboard extends Component {
  componentDidMount() {
    const {
      getUserBalanceAction: fetchUserBalance,
      getTokenBalance: fetchTokenBalance,
      getBuyRate: fetchBuyRate,
      getSellRate: fetchSellRate
    } = this.props;
    const { reserveAddress, reserveType } = this.props || {};
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress, reserveType);
    Object.keys(config.tokens).forEach(x => {
      if (config.tokens[x].reserveType === reserveType) {
        fetchBuyRate(x, 0.1);
        fetchSellRate(x, 10);
      }
    });
  }

  state = {
    depositEtherModalOpen: false,
    withdrawEtherModalOpen: false,
    depositEtherInput: "",
    withdrawEtherInput: ""
  };

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  handleWithdrawEtherModalOpen = () => this.setState({ withdrawEtherModalOpen: true });

  handleDepositEtherModalClose = () => this.setState({ depositEtherModalOpen: false, depositEtherInput: "" });

  handleWithdrawEtherModalClose = () => this.setState({ withdrawEtherModalOpen: false, withdrawEtherInput: "" });

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  onDepositEtherClick = e => {
    this.setState({ depositEtherModalOpen: true });
  };

  onWithdrawEtherClick = e => {
    this.setState({ withdrawEtherModalOpen: true });
  };

  depositClick = e => {
    const { depositEther: deposit } = this.props;
    const { userLocalPublicAddress, reserveAddress } = this.props || {};
    const { depositEtherInput } = this.state;
    deposit(depositEtherInput, reserveAddress, userLocalPublicAddress);
  };

  withdrawClick = e => {
    const { withdrawEther: withdraw } = this.props;
    const { userLocalPublicAddress, reserveAddress } = this.props || {};
    const { withdrawEtherInput } = this.state;
    withdraw(withdrawEtherInput, reserveAddress, userLocalPublicAddress);
  };

  render() {
    const {
      userBalance,
      tokenBalance,
      currentPortfolioValue,
      userLocalPublicAddress,
      depositEtherButtonSpinning,
      depositEtherButtonTransactionHash,
      withdrawEtherButtonSpinning,
      withdrawEtherButtonTransactionHash,
      reserveAddress,
      reserveType,
      publicAddress,
      etherScanLink
      // depositEtherSuccess,
      // withdrawEtherSuccess
    } = this.props || {};
    const { depositEtherInput, withdrawEtherInput, depositEtherModalOpen, withdrawEtherModalOpen } = this.state;
    const isOperator = userLocalPublicAddress === publicAddress;
    const isOwner = userLocalPublicAddress === config.owner;
    if (tokenBalance[reserveAddress] && currentPortfolioValue[reserveAddress]) {
      return (
        <Grid container="true">
          <Navbar />
          <CUICard style={{ marginTop: "100px" }}>
            <Row>
              <Col lg={8}>
                <div className="txt-m text--primary push-half--bottom  push-top--35">
                  Reserve ETH Balance : <span className="txt-m text--secondary">{userBalance[reserveAddress]}</span>
                </div>
                <div className="txt-m text--primary push-half--bottom">
                  Reserve Portfolio Value :{" "}
                  <span className="txt-m text--secondary">{formatMoney(currentPortfolioValue[reserveAddress].total, 0)}</span>
                </div>
              </Col>
              <Col lg={2} xsOffset={2}>
                <a href={etherScanLink} target="_blank" rel="noopener noreferrer">
                  View Reserve on Blockchain
                </a>
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <CustomToolTip disabled={!isOwner} title="You are not the owner">
                  <span>
                    <LoadingButton
                      className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                      disabled={!isOwner}
                      onClick={this.onDepositEtherClick}
                    >
                      Deposit Ether
                    </LoadingButton>
                  </span>
                </CustomToolTip>
              </Col>
              <Col lg={3}>
                <CustomToolTip disabled={!isOwner} title="You are not the owner">
                  <span>
                    <LoadingButton
                      className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                      disabled={!isOwner}
                      onClick={this.onWithdrawEtherClick}
                    >
                      Withdraw Ether
                    </LoadingButton>
                  </span>
                </CustomToolTip>
              </Col>
            </Row>
          </CUICard>
          {reserveType === "REGULAR" ? (
            <RegularReserveTable
              tokenBalance={tokenBalance[reserveAddress]}
              currentPortfolioValue={currentPortfolioValue[reserveAddress]}
              isOperator={isOperator}
              isOwner={isOwner}
            />
          ) : reserveType === "AUTOMATED" ? (
            <AutomatedReserveTable
              tokenBalance={tokenBalance[reserveAddress]}
              currentPortfolioValue={currentPortfolioValue[reserveAddress]}
              isOperator={isOperator}
              isOwner={isOwner}
            />
          ) : null}

          <CUICard>
            <Row center="lg">
              <Col>
                <TokenChart tokenBalance={tokenBalance[reserveAddress]} />
              </Col>
            </Row>
          </CUICard>
          <AlertModal open={depositEtherModalOpen} handleClose={this.handleDepositEtherModalClose}>
            <Grid>
              <Row className="push--bottom">
                <Col lg={12}>
                  <TextField
                    label="Enter Ether Amount"
                    value={depositEtherInput}
                    onChange={e => this.setState({ depositEtherInput: e.target.value })}
                  />
                </Col>
              </Row>
              <Row className="push--bottom">
                <Col lg={12}>
                  <Transaction
                    onClick={this.depositClick}
                    buttonText="Deposit"
                    txHash={depositEtherButtonTransactionHash}
                    buttonSpinning={depositEtherButtonSpinning}
                  />
                </Col>
              </Row>
            </Grid>
          </AlertModal>
          <AlertModal open={withdrawEtherModalOpen} handleClose={this.handleWithdrawEtherModalClose}>
            <Grid>
              <Row className="push--bottom">
                <Col lg={12}>
                  <TextField
                    label="Enter Ether Amount"
                    value={withdrawEtherInput}
                    onChange={e => this.setState({ withdrawEtherInput: e.target.value })}
                  />
                </Col>
              </Row>
              <Row className="push--bottom">
                <Col lg={12}>
                  <Transaction
                    onClick={this.withdrawClick}
                    buttonText="Withdraw"
                    txHash={withdrawEtherButtonTransactionHash}
                    buttonSpinning={withdrawEtherButtonSpinning}
                  />
                </Col>
              </Row>
            </Grid>
          </AlertModal>
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

MarketMakerDashboard.propTypes = {
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  depositEther: Proptypes.func.isRequired,
  withdrawEther: Proptypes.func.isRequired,
  getBuyRate: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData, signinManagerData, tradeData, auth } = state;
  const {
    userData: { publicAddress, reserveAddress, reserveType }
  } = auth || {};
  const { userBalance, tokenBalance } = userData || {};
  const {
    dropDownSelect,
    depositEtherButtonSpinning,
    depositEtherButtonTransactionHash,
    depositEtherSuccess,
    withdrawEtherButtonSpinning,
    withdrawEtherButtonTransactionHash,
    withdrawEtherSuccess,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash,
    modifyRatesSuccess
  } = marketMakerData || {};
  const { buyTradeData: buyPriceData, sellTradeData: sellPriceData } = tradeData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  const etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
  return {
    publicAddress,
    etherScanLink,
    reserveAddress,
    reserveType,
    userBalance,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state),
    dropDownSelect,
    userLocalPublicAddress,
    depositEtherButtonSpinning,
    depositEtherButtonTransactionHash,
    depositEtherSuccess,
    withdrawEtherButtonSpinning,
    withdrawEtherButtonTransactionHash,
    withdrawEtherSuccess,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash,
    modifyRatesSuccess,
    buyPriceData,
    sellPriceData
  };
};

export default connect(
  mapStateToProps,
  {
    onDropdownChange,
    getTokenBalance,
    getUserBalanceAction,
    depositEther,
    withdrawEther,
    setCompactData,
    setQtyStepFunction,
    getBuyRate,
    getSellRate
  }
)(MarketMakerDashboard);
