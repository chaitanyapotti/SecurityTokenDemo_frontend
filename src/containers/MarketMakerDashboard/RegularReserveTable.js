import React, { Component } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Divider, TextField } from "@material-ui/core";

import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "../../components/common/FormComponents";
import { getEtherScanAddressLink, significantDigits, formatFromWei } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken, withdrawAction, setQtyStepFunction, setCompactData, setImbalanceStepFunction } from "../../actions/marketMakerActions";
import LoadingButton from "../../components/common/LoadingButton";
import TokenPriceTable from "../../components/common/TokenPriceTable";

class RegularReserveTable extends Component {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    modifyImbalanceRatesModalOpen: false,
    modifyRatesModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    token: "",
    tradeModalOpen: false,
    modifyBuyPrice: "",
    modifySellPrice: "",
    buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    imbalanceBuyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    imbalanceSellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  handleTradeModalOpen = () => this.setState({ tradeModalOpen: true });

  handleTradeModalClose = () =>
    this.setState({
      tradeModalOpen: false,
      sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
      buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
    });

  handleModifyRatesModalOpen = () => this.setState({ modifyRatesModalOpen: true });

  handleModifyRatesModalClose = () => this.setState({ modifyRatesModalOpen: false, modifyBuyPrice: "", modifySellPrice: "" });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false, depositTokenInput: "" });

  handleWithdrawTokenModalOpen = () => this.setState({ withdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ withdrawTokenModalOpen: false, withdrawTokenInput: "" });

  handleModifyImbalanceRatesModalClose = () =>
    this.setState({
      modifyImbalanceRatesModalOpen: false,
      imbalanceBuyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
      imbalanceSellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
    });

  onModifyRatesClick = key => this.setState({ modifyRatesModalOpen: true, token: key });

  onTradeClick = key => {
    this.setState({ tradeModalOpen: true, token: key });
    let { buyTradeData, sellTradeData } = this.state;
    const { buyPriceData, sellPriceData } = this.props || {};
    buyTradeData = JSON.parse(JSON.stringify(buyTradeData));
    sellTradeData = JSON.parse(JSON.stringify(sellTradeData));
    buyTradeData[0].rate = buyPriceData[key] && buyPriceData[key].rate ? formatFromWei(buyPriceData[key].rate, 3) : 0;
    buyTradeData[0].percent = "0";
    sellTradeData[0].rate = sellPriceData[key] && sellPriceData[key].rate ? (Math.pow(10, 18) / sellPriceData[key].rate).toFixed(3) : 0;
    sellTradeData[0].percent = "0";
    this.setState({ buyTradeData, sellTradeData });
  };

  onDepositClick = key => this.setState({ depositTokenModalOpen: true, token: key });

  onWithdrawClick = key => this.setState({ withdrawTokenModalOpen: true, token: key });

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { modifyBuyPrice, modifySellPrice, token } = this.state;
    modifyRatesAction(token, modifyBuyPrice, modifySellPrice, userLocalPublicAddress);
  };

  onModifyImbalanceRatesClick = key => this.setState({ modifyImbalanceRatesModalOpen: true, token: key });

  depositTokenClick = e => {
    const { depositToken: doDepositToken } = this.props;
    const { userLocalPublicAddress, reserveType } = this.props || {};
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { token, depositTokenInput } = this.state;

    doDepositToken(depositTokenInput, token, reserveAddress, userLocalPublicAddress, reserveType);
  };

  withdrawTokenClick = e => {
    const { withdrawAction: withdrawToken } = this.props;
    const { userLocalPublicAddress, reserveType } = this.props || {};
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { token, withdrawTokenInput } = this.state;

    withdrawToken(token, withdrawTokenInput, userLocalPublicAddress, reserveAddress, reserveType);
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

  setQtyStepFunc = () => {
    const { buyTradeData, sellTradeData, token } = this.state;
    const { userLocalPublicAddress } = this.props || {};
    const { setQtyStepFunction: setQtySteps } = this.props;
    setQtySteps(
      token,
      buyTradeData.map(x => significantDigits(x.rate)),
      buyTradeData.map(x => -Math.round(x.percent * 100)),
      sellTradeData.map(x => significantDigits(x.rate)),
      sellTradeData.map(x => Math.round(x.percent * 100)),
      userLocalPublicAddress
    );
  };

  setQtyImbalanceFunc = () => {
    const { imbalanceBuyTradeData, imbalanceSellTradeData, token } = this.state;
    const { userLocalPublicAddress } = this.props || {};
    const { setImbalanceStepFunction: setQtySteps } = this.props;
    setQtySteps(
      token,
      imbalanceBuyTradeData.map(x => significantDigits(x.rate)),
      imbalanceBuyTradeData.map(x => -Math.round(x.percent * 100)),
      [...imbalanceSellTradeData.map(x => -significantDigits(x.rate)), 0],
      [...imbalanceSellTradeData.map(x => Math.round(x.percent * 100)), 0],
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
      imbalanceButtonSpinning,
      imbalanceButtonTransactionHash,
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
      modifyImbalanceRatesModalOpen,
      imbalanceSellTradeData,
      imbalanceBuyTradeData,
      modifyRatesModalOpen,
      modifyBuyPrice,
      modifySellPrice
    } = this.state;
    return (
      <div>
        <TokenPriceTable
          buyPriceData={buyPriceData}
          sellPriceData={sellPriceData}
          currentPortfolioValue={currentPortfolioValue}
          tokenBalance={tokenBalance}
        />
        <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Token Name</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Deposit</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Withdraw</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Modify Bid/Ask Prices</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Modify Step Prices</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Modify Imbalance Prices</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Etherscan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => (
              <TableRow key={key}>
                <TableCell className="txt-s table-text-pad" verticalAlign="middle">{config.tokens[key].name}</TableCell>
                <TableCell className="txt-s table-text-pad" verticalAlign="middle">
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
                <TableCell className="txt-s table-text-pad" verticalAlign="middle">
                  <CustomToolTip disabled={!isOwner} title="You are not the operator">
                    <span>
                      <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                        View on Blockchain
                      </a>
                    </span>
                    </CustomToolTip>
                  </TableCell>
                </TableRow>
              ))}
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
            <Divider>Buy</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHead className="txt-s txt-dddbld table-text-pad  table-head-clr">Quantity</TableHead>
                    <TableHead className="txt-s txt-dddbld table-text-pad  table-head-clr">%</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buyTradeData.map((item, index) => (
                    // eslint-disable-next-line
                    <TableRow key={index}>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Buy Quantity" value={item.rate} onChange={e => this.updateBuyArray(e, index, "rate")} />
                      </TableCell>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Buy Percent" value={item.percent} onChange={e => this.updateBuyArray(e, index, "percent")} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Divider>Sell</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHead className="txt-s txt-dddbld table-text-pad  table-head-clr">Quantity</TableHead>
                    <TableHead className="txt-s txt-dddbld table-text-pad  table-head-clr">%</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellTradeData.map((item, index) => (
                    // eslint-disable-next-line
                    <TableRow key={index}>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Sell Quantity" value={item.rate} onChange={e => this.updateSellArray(e, index, "rate")} />
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
                  txHash={tradeButtonTransactionHash}
                  buttonSpinning={tradeButtonSpinning}
                />
              </Col>
            </Row>
          </Grid>
        </AlertModal>
        <AlertModal open={modifyImbalanceRatesModalOpen} handleClose={this.handleModifyImbalanceRatesModalClose}>
          <Grid>
            <Divider>Buy</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Quantity</TableCell>
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {imbalanceBuyTradeData.map((item, index) => (
                    // eslint-disable-next-line
                    <TableRow key={index}>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Buy Quantity" value={item.rate} onChange={e => this.updateImbalanceBuyArray(e, index, "rate")} />
                      </TableCell>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Buy Percent" value={item.percent} onChange={e => this.updateImbalanceBuyArray(e, index, "percent")} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Divider>Sell (Hi to Lo)</Divider>
            <Paper style={{ marginBottom: "20px" }} className="card-brdr">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Quantity</TableCell>
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {imbalanceSellTradeData.map((item, index) => (
                    // eslint-disable-next-line
                    <TableRow key={index}>
                      <TableCell className="txt-s table-text-pad">
                        <TextField label="Enter Sell Quantity" value={item.rate} onChange={e => this.updateImbalanceSellArray(e, index, "rate")} />
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
                  onClick={this.setQtyImbalanceFunc}
                  buttonText="Set Imbalance Steps"
                  txHash={imbalanceButtonTransactionHash}
                  buttonSpinning={imbalanceButtonSpinning}
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
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Bid ($)</TableCell>
                    <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Ask ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="txt-s table-text-pad">
                      <TextField
                        label="Enter Sell Price"
                        value={modifySellPrice}
                        onChange={e => this.setState({ modifySellPrice: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="txt-s table-text-pad">
                      <TextField label="Enter Buy Price" value={modifyBuyPrice} onChange={e => this.setState({ modifyBuyPrice: e.target.value })} />
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
    imbalanceButtonSpinning,
    imbalanceButtonTransactionHash,
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
    modifyRatesTransactionHash,
    imbalanceButtonSpinning,
    imbalanceButtonTransactionHash
  };
};

RegularReserveTable.propTypes = {
  depositToken: Proptypes.func.isRequired,
  withdrawAction: Proptypes.func.isRequired,
  setQtyStepFunction: Proptypes.func.isRequired,
  setImbalanceStepFunction: Proptypes.func.isRequired,
  setCompactData: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken, withdrawAction, setQtyStepFunction, setCompactData, setImbalanceStepFunction }
)(RegularReserveTable);
