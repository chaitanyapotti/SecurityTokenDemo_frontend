import React, { Component } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField } from "@material-ui/core";

import { connect } from "react-redux";
import Proptypes from "prop-types";
import LoadingButton from "../../components/common/LoadingButton";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange, depositEther, setCompactData, setQtyStepFunction, withdrawEther } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { getBuyRate, getSellRate } from "../../actions/tradeActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import EtherScanHoldingsTable from "./EtherScanHoldingsTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";
import { formatMoney, getEtherScanAddressLink, calculateInversePercentChange } from "../../helpers/numberHelpers";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { CustomToolTip } from "../../components/common/FormComponents";
import { getPortfolioSelector } from "../../selectors";

class MarketMakerDashboard extends Component {
  componentWillMount() {
    const {
      getUserBalanceAction: fetchUserBalance,
      getTokenBalance: fetchTokenBalance,
      getBuyRate: fetchBuyRate,
      getSellRate: fetchSellRate
    } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status, reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
    this.setState({ first_name, email, phone, id, role, date, status, etherScanLink, publicAddress, reserveAddress });
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
    Object.keys(config.tokens).forEach(x => {
      fetchBuyRate(x, 0.1);
      fetchSellRate(x, 10);
    });
  }

  state = {
    depositEtherModalOpen: false,
    withdrawEtherModalOpen: false,
    modifyRatesModalOpen: false,
    depositEtherInput: "",
    withdrawEtherInput: "",
    buyPercent: { RIV: "", LMD: "" },
    sellPercent: { RIV: "", LMD: "" }
  };

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  handleWithdrawEtherModalOpen = () => this.setState({ withdrawEtherModalOpen: true });

  handleModifyRatesModalOpen = () => this.setState({ modifyRatesModalOpen: true });

  handleModifyRatesModalClose = () =>
    this.setState({ modifyRatesModalOpen: false, buyPercent: { RIV: "", LMD: "" }, sellPercent: { RIV: "", LMD: "" } });

  handleDepositEtherModalClose = () => this.setState({ depositEtherModalOpen: false, depositEtherInput: "" });

  handleWithdrawEtherModalClose = () => this.setState({ withdrawEtherModalOpen: false, withdrawEtherInput: "" });

  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

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

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    const { userLocalPublicAddress, buyPriceData, sellPriceData } = this.props || {};
    const { buyPercent, sellPercent } = this.state;
    console.log(Object.keys(config.tokens).map(i => calculateInversePercentChange(buyPercent[i], buyPriceData[i].price)), "buy");
    console.log(Object.keys(config.tokens).map(i => calculateInversePercentChange(sellPercent[i], sellPriceData[i].price)), "sell");
    modifyRatesAction(
      Object.keys(config.tokens).map(i => calculateInversePercentChange(buyPercent[i], buyPriceData[i].price)),
      Object.keys(config.tokens).map(i => calculateInversePercentChange(sellPercent[i], sellPriceData[i].price)),
      userLocalPublicAddress
    );
  };

  depositClick = e => {
    const { depositEther: deposit } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { depositEtherInput, reserveAddress } = this.state;
    deposit(depositEtherInput, reserveAddress, userLocalPublicAddress);
  };

  withdrawClick = e => {
    const { withdrawEther: withdraw } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { withdrawEtherInput, reserveAddress } = this.state;
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
      // depositEtherSuccess,
      // withdrawEtherSuccess,
      modifyRatesButtonSpinning,
      modifyRatesTransactionHash
      // modifyRatesSuccess
    } = this.props || {};
    const {
      first_name,
      email,
      phone,
      id,
      role,
      date,
      status,
      publicAddress,
      etherScanLink,
      depositEtherInput,
      withdrawEtherInput,
      depositEtherModalOpen,
      withdrawEtherModalOpen,
      modifyRatesModalOpen,
      reserveAddress,
      buyPercent,
      sellPercent
    } = this.state;
    const isOperator = userLocalPublicAddress === publicAddress;
    const isOwner = userLocalPublicAddress === config.owner;
    if (tokenBalance[reserveAddress] && currentPortfolioValue[reserveAddress]) {
      return (
        <Grid container="true">
          <Navbar />
          <div style={{ marginTop: "100px" }}>
            <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
          </div>
          <CUICard style={{ marginTop: "10px" }}>
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
                {/* <Button className="btn bg--danger txt-p-vault txt-dddbld text--white push--bottom" onClick={this.onLogoutClick}>
                Logout
              </Button> */}
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
          {/* <CUICard>
          <Row>
            <Col lg={8}>
              <span className="txt-m text--primary push--bottom">
                Select Token :{" "}
                <Dropdown className="txt-s" onChange={this.onDropdownChange} selection label="Select Token" options={tokenOptions} />
              </span>
            </Col>
            <Col lg={4} />
          </Row>
          {dropDownSelect ? (
            <Row>
              <Col />
            </Row>
          ) : null}
        </CUICard> */}

          <EtherScanHoldingsTable
            tokenBalance={tokenBalance[reserveAddress]}
            currentPortfolioValue={currentPortfolioValue[reserveAddress]}
            isOperator={isOperator}
            isOwner={isOwner}
          />

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
          <AlertModal open={modifyRatesModalOpen} handleClose={this.handleModifyRatesModalClose}>
            <Grid>
              <Paper style={{ marginBottom: "20px" }} className="card-brdr">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="txt-s">Token</TableCell>
                      <TableCell className="txt-s">Bid (%)</TableCell>
                      <TableCell className="txt-s">Ask (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(config.tokens).map(key => (
                      <TableRow key={key}>
                        <TableCell className="txt-s">{key}</TableCell>
                        <TableCell className="txt-s">
                          <TextField
                            label="Enter Sell % Change"
                            value={sellPercent[key]}
                            onChange={e => this.setState({ sellPercent: { ...sellPercent, [key]: e.target.value } })}
                          />
                        </TableCell>
                        <TableCell className="txt-s">
                          <TextField
                            label="Enter Buy % Change"
                            value={buyPercent[key]}
                            onChange={e => this.setState({ buyPercent: { ...buyPercent, [key]: e.target.value } })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <Row className="push--bottom">
                <Col lgOffset={9} lg={3}>
                  <Transaction
                    buttonText="Modify"
                    onClick={this.onModifyClick}
                    txHash={modifyRatesTransactionHash}
                    buttonSpinning={modifyRatesButtonSpinning}
                  />
                </Col>
              </Row>
            </Grid>
          </AlertModal>
        </Grid>
      );
    }
    return <div />;
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  depositEther: Proptypes.func.isRequired,
  withdrawEther: Proptypes.func.isRequired,
  setCompactData: Proptypes.func.isRequired,
  getBuyRate: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData, signinManagerData, tradeData } = state;
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
  return {
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
    logoutUserAction,
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
