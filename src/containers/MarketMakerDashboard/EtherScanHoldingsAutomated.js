import React, { Component } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper, Divider } from "@material-ui/core";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "../../components/common/FormComponents";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken, withdrawAction, setQtyStepFunction, setCompactData } from "../../actions/marketMakerActions";
import LoadingButton from "../../components/common/LoadingButton";

class EtherScanHoldingsTableAutomated extends Component {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    modifyImbalanceRatesModalOpen: false,
    modifyRatesModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    token: "",
    tradeModalOpen: false,
    modifyRateBuyPercent: "",
    modifyRateSellPercent: "",
    buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    imbalanceBuyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    imbalanceSellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  handleTradeModalOpen = () => this.setState({ tradeModalOpen: true });

  handleTradeModalClose = () =>
    this.setState({
      tradeModalOpen: false,
      sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
      buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
    });

  handleModifyRatesModalOpen = () => this.setState({ modifyRatesModalOpen: true });

  handleModifyRatesModalClose = () => this.setState({ modifyRatesModalOpen: false, modifyRateBuyPercent: "", modifyRateSellPercent: "" });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false, depositTokenInput: "" });

  handleWithdrawTokenModalOpen = () => this.setState({ withdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ withdrawTokenModalOpen: false, withdrawTokenInput: "" });

  handleModifyImbalanceRatesModalClose = () => this.setState({ modifyImbalanceRatesModalOpen: false });

  onDepositClick = key => {
    this.setState({ depositTokenModalOpen: true, token: key });
  };

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { modifyRateBuyPercent, modifyRateSellPercent, token } = this.state;
    modifyRatesAction(token, modifyRateBuyPercent, modifyRateSellPercent, userLocalPublicAddress);
  };

  onWithdrawClick = key => {
    this.setState({ withdrawTokenModalOpen: true, token: key });
  };

  onTradeClick = key => {
    this.setState({ tradeModalOpen: true, token: key });
  };

  depositTokenClick = e => {
    const { depositToken: doDepositToken } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { token, depositTokenInput } = this.state;

    doDepositToken(depositTokenInput, token, reserveAddress, userLocalPublicAddress);
  };

  withdrawTokenClick = e => {
    const { withdrawAction: withdrawToken } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { token, withdrawTokenInput } = this.state;

    withdrawToken(token, withdrawTokenInput, userLocalPublicAddress, reserveAddress);
  };

  updateBuyArray = (e, i, obj) => {
    const { buyTradeData } = this.state;
    const newArray = buyTradeData.map((item, index) => {
      if (index !== i) return item;
      return { ...item, [obj]: e.target.value };
    });
    this.setState({ buyTradeData: newArray });
  };

  updateSellArray = (e, i, obj) => {
    const { sellTradeData } = this.state;
    const newArray = sellTradeData.map((item, index) => {
      if (index !== i) return item;
      return { ...item, [obj]: e.target.value };
    });
    this.setState({ sellTradeData: newArray });
  };

  updateImbalanceBuyArray = (e, i, obj) => {
    const { imbalanceBuyTradeData } = this.state;
    const newArray = imbalanceBuyTradeData.map((item, index) => {
      if (index !== i) return item;
      return { ...item, [obj]: e.target.value };
    });
    this.setState({ imbalanceBuyTradeData: newArray });
  };

  updateImbalanceSellArray = (e, i, obj) => {
    const { imbalanceSellTradeData } = this.state;
    const newArray = imbalanceSellTradeData.map((item, index) => {
      if (index !== i) return item;
      return { ...item, [obj]: e.target.value };
    });
    this.setState({ imbalanceSellTradeData: newArray });
  };

  onModifyRatesClick = e => {
    this.setState({ modifyRatesModalOpen: true });
  };

  onModifyImbalanceRatesClick = e => {
    this.setState({ modifyImbalanceRatesModalOpen: true });
  };

  setQtyStepFunc = () => {
    const { buyTradeData, sellTradeData, token } = this.state;
    const { userLocalPublicAddress } = this.props || {};
    const { setQtyStepFunction: setQtySteps } = this.props;
    setQtySteps(
      token,
      buyTradeData.map(x => significantDigits(1 / x.rate)),
      buyTradeData.map(x => Math.round(x.percent * 100)),
      sellTradeData.map(x => significantDigits(1 / x.rate)),
      sellTradeData.map(x => Math.round(x.percent * 100)),
      userLocalPublicAddress
    );
  };

  render() {
    const {
      tokenBalance,
      isOperator,
      currentPortfolioValue,
      transferTokenButtonSpinning,
      transferTokenButtonTransactionHash,
      // transferTokenSuccess,
      withdrawTokenButtonSpinning,
      withdrawTokenButtonTransactionHash,
      // withdrawTokenSuccess,
      isOwner,
      tradeSuccess,
      tradeButtonSpinning,
      tradeButtonTransactionHash,
      buyPriceData,
      sellPriceData,
      modifyRatesButtonSpinning,
      modifyRatesTransactionHash
    } = this.props || {};
    const {
      buyTradeData,
      sellTradeData,
      depositTokenModalOpen,
      depositTokenInput,
      withdrawTokenModalOpen,
      withdrawTokenInput,
      tradeModalOpen,
      token,
      modifyImbalanceRatesModalOpen,
      imbalanceSellTradeData,
      imbalanceBuyTradeData,
      modifyRatesModalOpen,
      modifyRateBuyPercent,
      modifyRateSellPercent
    } = this.state;
    return (
      <div>
        <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Token Name</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Token Count</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Token Value($)</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Token Price($)</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Ask Price($)</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Bid Price($)</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Deposit</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Withdraw</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => {
              const buyDollarPrice = buyPriceData[key] && buyPriceData[key].price ? buyPriceData[key].price * config.etherPrice : 0;
              const sellDollarPrice = sellPriceData[key] && sellPriceData[key].price ? config.etherPrice / sellPriceData[key].price : 0;
              return (
                <TableRow key={key}>
                <TableCell className="txt-s table-text-pad">{config.tokens[key].name}</TableCell>
                <TableCell className="txt-s table-text-pad">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                <TableCell className="txt-s table-text-pad">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                <TableCell className="txt-s table-text-pad">{parseFloat(currentPortfolioValue[key] / tokenBalance[key].balance).toFixed(3)}</TableCell>
                <TableCell className="txt-s table-text-pad">{sellDollarPrice.toFixed(3)}</TableCell>
                <TableCell className="txt-s table-text-pad">{buyDollarPrice.toFixed(3)}</TableCell>
                <TableCell className="txt-s table-text-pad">
                    <CustomToolTip disabled={!isOwner} title="You are not the owner">
                      <span>
                        <LoadingButton
                          className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                          disabled={!isOwner}
                          onClick={() => this.onDepositClick(key)}
                        >
                          Deposit
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  </TableCell>
                  <TableCell className="txt-s table-text-pad">
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <LoadingButton
                          className="btn bg--danger txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={() => this.onWithdrawClick(key)}
                        >
                          Withdraw
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </Paper>
        <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Token Name</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Trade</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Modify Rates</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Modify Imbalance Rates</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Etherscan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => {
              return (
                <TableRow key={key}>
                <TableCell className="txt-s table-text-pad">{config.tokens[key].name}</TableCell>
                <TableCell className="txt-s table-text-pad">
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <LoadingButton
                          className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={() => this.onTradeClick(key)}
                        >
                          Set Step Price
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  </TableCell>
                  <TableCell className="txt-s table-text-pad">
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <LoadingButton
                          className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={() => this.onModifyRatesClick(key)}
                        >
                          Modify Rates
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  </TableCell>
                  <TableCell className="txt-s table-text-pad">
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <LoadingButton
                          className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={() => this.onModifyImbalanceRatesClick(key)}
                        >
                          Modify Imbalance Rates
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  </TableCell>
                  <TableCell className="txt-s table-text-pad">
                    <span>
                      <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                        View on Blockchain
                      </a>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
        </Table>
        </Paper>
        <AlertModal open={depositTokenModalOpen} handleClose={this.handleDepositTokenModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <TextField
                  label="Enter No Of Tokens"
                  value={depositTokenInput}
                  onChange={e => this.setState({ depositTokenInput: e.target.value })}
                />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <Transaction
                  onClick={this.depositTokenClick}
                  buttonText="Deposit"
                  txHash={transferTokenButtonTransactionHash}
                  buttonSpinning={transferTokenButtonSpinning}
                />
              </Col>
            </Row>
          </Grid>
        </AlertModal>
        <AlertModal open={withdrawTokenModalOpen} handleClose={this.handleWithdrawTokenModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <TextField
                  label="Enter No Of Tokens"
                  value={withdrawTokenInput}
                  onChange={e => this.setState({ withdrawTokenInput: e.target.value })}
                />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <Transaction
                  onClick={this.withdrawTokenClick}
                  buttonText="Withdraw"
                  txHash={withdrawTokenButtonTransactionHash}
                  buttonSpinning={withdrawTokenButtonSpinning}
                />
              </Col>
            </Row>
          </Grid>
        </AlertModal>
        <AlertModal open={tradeModalOpen} handleClose={this.handleTradeModalClose}>
          <Grid>
            <Divider horizontal>Buy</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
            <Table>
              <TableHead>
                <TableRow>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Quantity</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buyTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <TableRow key={index}>
                  <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Buy Price" value={item.rate} onChange={e => this.updateBuyArray(e, index, "rate")} />
                    </TableCell>
                    <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Buy Percent" value={item.percent} onChange={e => this.updateBuyArray(e, index, "percent")} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Paper>
            <Divider horizontal>Sell</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
            <Table>
              <TableHead>
                <TableRow>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Quantity</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <TableRow key={index}>
                  <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Sell Price" value={item.rate} onChange={e => this.updateSellArray(e, index, "rate")} />
                    </TableCell>
                    <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Sell Percent" value={item.percent} onChange={e => this.updateSellArray(e, index, "percent")} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Paper>
            <Row className="push--bottom">
              <Col lg={12}>
                <Transaction
                  onClick={this.setQtyStepFunc}
                  buttonText="Set Rate Steps"
                  success={tradeSuccess}
                  txHash={tradeButtonTransactionHash}
                  buttonSpinning={tradeButtonSpinning}
                />
              </Col>
            </Row>
          </Grid>
        </AlertModal>
        <AlertModal open={modifyImbalanceRatesModalOpen} handleClose={this.handleModifyImbalanceRatesModalClose}>
          <Grid>
            <Divider horizontal>Buy</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
            <Table>
              <TableHead>
                <TableRow>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Quantity</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {imbalanceBuyTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <TableRow key={index}>
                  <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Buy Price" value={item.rate} onChange={e => this.updateImbalanceBuyArray(e, index, "rate")} />
                    </TableCell>
                    <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Buy Percent" value={item.percent} onChange={e => this.updateBuyArray(e, index, "percent")} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Paper>
            <Divider horizontal>Sell</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
            <Table>
              <TableHead>
                <TableRow>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Quantity</TableCell>
                  <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {imbalanceSellTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <TableRow key={index}>
                  <TableCell className="txt-s table-text-pad">
                      <TextField input="Enter Sell Price" value={item.rate} onChange={e => this.updateImbalanceSellArray(e, index, "rate")} />
                    </TableCell>
                    <TableCell className="txt-s table-text-pad">
                      <TextField
                        label="Enter Sell Percent"
                        value={item.percent}
                        onChange={e => this.updateImbalanceSellArray(e, index, "percent")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Paper>
            <Row className="push--bottom">
              <Col lg={12}>
                <Transaction
                  onClick={this.setQtyStepFunc}
                  buttonText="Set Imbalance Rates"
                  success={tradeSuccess}
                  txHash={tradeButtonTransactionHash}
                  buttonSpinning={tradeButtonSpinning}
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
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Ask(%)</TableCell>
                <TableCell className="txt-s txt-dddbld table-text-pad table-head-clr">Bid(%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                <TableCell className="txt-s table-text-pad">
                    <TextField
                      label="Enter Sell Percent"
                      value={modifyRateSellPercent}
                      onChange={e => this.setState({ modifyRateSellPercent: e.target.value })}
                    />
                  </TableCell>
                  <TableCell className="txt-s table-text-pad">
                    <TextField
                      label="Enter Buy Percent"
                      value={modifyRateBuyPercent}
                      onChange={e => this.setState({ modifyRateBuyPercent: e.target.value })}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </Paper>
            <Row className="push--bottom">
              <Col lgOffset={8} lg={4}>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { marketMakerData, signinManagerData, tradeData } = state;
  const {
    transferTokenButtonSpinning,
    transferTokenButtonTransactionHash,
    transferTokenSuccess,
    withdrawTokenButtonSpinning,
    withdrawTokenButtonTransactionHash,
    withdrawTokenSuccess,
    tradeSuccess,
    tradeButtonSpinning,
    tradeButtonTransactionHash,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash
  } = marketMakerData || {};

  const { buyTradeData: buyPriceData, sellTradeData: sellPriceData } = tradeData || {};

  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    transferTokenButtonSpinning,
    transferTokenButtonTransactionHash,
    transferTokenSuccess,
    userLocalPublicAddress,
    withdrawTokenButtonSpinning,
    withdrawTokenButtonTransactionHash,
    withdrawTokenSuccess,
    tradeSuccess,
    tradeButtonSpinning,
    tradeButtonTransactionHash,
    buyPriceData,
    sellPriceData,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash
  };
};

EtherScanHoldingsTableAutomated.propTypes = {
  depositToken: Proptypes.func.isRequired,
  withdrawAction: Proptypes.func.isRequired,
  setQtyStepFunction: Proptypes.func.isRequired,
  setCompactData: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken, withdrawAction, setQtyStepFunction, setCompactData }
)(EtherScanHoldingsTableAutomated);
