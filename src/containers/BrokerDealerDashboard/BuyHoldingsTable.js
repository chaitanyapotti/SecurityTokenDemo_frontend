import React, { Component } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField } from "@material-ui/core";

import { connect } from "react-redux";
import Proptypes from "prop-types";
import { formatCurrencyNumber, formatMoney, formatFromWei, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import LoadingButton from "../../components/common/LoadingButton";
import {
  getBuyRate,
  getSellRate,
  buyTokenAction,
  sellTokenAction,
  transferTokensToUser,
  transferTokensFromUser,
  approveTokenTransfer
} from "../../actions/tradeActions";
import { CustomToolTip } from "../../components/common/FormComponents";
import Transaction from "../../components/common/FormComponents/Transaction";

class BuyHoldingsTable extends Component {
  state = {
    buyModalOpen: false,
    sellModalOpen: false,
    buyInput: "",
    buyToken: "",
    sellToken: "",
    sellInput: ""
  };

  handleBuyModalOpen = () => this.setState({ buyModalOpen: true });

  handleBuyModalClose = () => this.setState({ buyModalOpen: false });

  handleSellModalOpen = () => this.setState({ sellModalOpen: true });

  handleSellModalClose = () => this.setState({ sellModalOpen: false });

  onBuyClick = key => {
    this.setState({ buyModalOpen: true, buyToken: key });
  };

  onBuyTokenClick = () => {
    const { buyTokenAction: doBuyToken } = this.props;
    const { buyTradeData, userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { buyToken, buyInput } = this.state;
    doBuyToken(buyToken, buyInput, userLocalPublicAddress, buyTradeData[buyToken].rate, dropDownSelect);
  };

  onSellClick = key => {
    this.setState({ sellModalOpen: true, sellToken: key });
  };

  onSellTokenClick = () => {
    const { sellTokenAction: doSellToken } = this.props;
    const { sellTradeData, userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { sellToken, sellInput } = this.state;
    doSellToken(sellToken, sellInput, userLocalPublicAddress, sellTradeData[sellToken].rate, dropDownSelect);
  };

  onApproveClick = () => {
    const { approveTokenTransfer: doApprove } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { sellToken, sellInput } = this.state;
    doApprove(sellToken, sellInput, userLocalPublicAddress);
  };

  getPriceClick = () => {
    const { getBuyRate: fetchBuyRate } = this.props;
    const { buyToken, buyInput } = this.state;
    fetchBuyRate(buyToken, buyInput);
  };

  getSellPriceClick = () => {
    const { getSellRate: fetchSellRate } = this.props;
    const { sellToken, sellInput } = this.state;
    fetchSellRate(sellToken, sellInput);
  };

  onTransferTokenClick = () => {
    const { transferTokensToUser: transfer } = this.props;
    const { buyTradeData, userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { buyToken, buyInput } = this.state;
    const tokenCount = parseFloat(buyTradeData[buyToken].rate) * parseFloat(buyInput);
    transfer(buyToken, Math.round(tokenCount).toString(), userLocalPublicAddress, dropDownSelect);
  };

  onTransferFromTokenClick = () => {
    const { transferTokensFromUser: transferFrom } = this.props;
    const { userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { sellToken, sellInput } = this.state;
    transferFrom(sellToken, sellInput, userLocalPublicAddress, dropDownSelect);
  };

  render() {
    const {
      tokenBalance,
      currentPortfolioValue,
      buyTradeData,
      sellTradeData,
      buyButtonSpinning,
      transferButtonSpinning,
      userLocalPublicAddress,
      publicAddress,
      buyButtonTransactionHash,
      transferButtonTransactionHash,
      buySuccess,
      transferSuccess,
      sellButtonSpinning,
      transferFromButtonSpinning,
      sellButtonTransactionHash,
      transferFromButtonTransactionHash,
      sellSuccess,
      transferFromSuccess,
      approveSuccess,
      approveButtonTransactionHash,
      approveButtonSpinning,
      dropDownSelect
    } = this.props || {};
    const { buyModalOpen, sellModalOpen, buyInput, buyToken, sellInput, sellToken } = this.state;
    const userTokenBalance = tokenBalance[dropDownSelect] || {};
    let buyPrice = buyTradeData && buyTradeData[buyToken] ? buyTradeData[buyToken].price * config.etherPrice : 0;
    let sellPrice = sellTradeData && sellTradeData[sellToken] ? config.etherPrice / sellTradeData[sellToken].price : 0;
    if (!isFinite(buyPrice) || buyPrice === 0) {
      buyPrice = "No trades available";
    } else {
      buyPrice = `${formatMoney(buyPrice)}`;
    }
    if (!isFinite(sellPrice) || sellPrice === 0) {
      sellPrice = "No trades available";
    } else {
      sellPrice = `${formatMoney(sellPrice)}`;
    }
    const isOperator = userLocalPublicAddress === publicAddress;
    return (
      <div>
        <Paper style={{ marginBottom: "20px" }} className="card-brdr">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="txt-s">Token Name</TableCell>
                <TableCell className="txt-s">Token Count</TableCell>
                <TableCell className="txt-s">Invested Value($)</TableCell>
                <TableCell className="txt-s">Current Value($)</TableCell>
                <TableCell className="txt-s">Token Price($)</TableCell>
                <TableCell className="txt-s">Change</TableCell>
                <TableCell className="txt-s">Buy</TableCell>
                <TableCell className="txt-s">Sell</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(userTokenBalance).map(key => {
                const { balance, dollarValue } = userTokenBalance[key] || {};
                return (
                  <TableRow key={key}>
                    <TableCell className="txt-s" verticalAlign="middle">{config.tokens[key].name}</TableCell>
                    <TableCell className="txt-s" verticalAlign="middle">{formatCurrencyNumber(balance, 0)}</TableCell>
                    <TableCell className="txt-s" verticalAlign="middle">{formatMoney(dollarValue, 0)}</TableCell>
                    <TableCell className="txt-s" verticalAlign="middle">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                    <TableCell className="txt-s" verticalAlign="middle">{significantDigits(currentPortfolioValue[key] / balance)}</TableCell>
                    <TableCell className="txt-s" verticalAlign="middle">
                      {`+${formatMoney(currentPortfolioValue[key] - dollarValue, 0)}(+${Math.round(
                        ((currentPortfolioValue[key] - dollarValue) * 100) / dollarValue,
                        2
                      )}%)`}
                    </TableCell>
                    <TableCell className="txt-s">
                      <CustomToolTip disabled={!isOperator} title="You are not the operator">
                        <span>
                          <LoadingButton
                            className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                            disabled={!isOperator}
                            onClick={() => this.onBuyClick(key)}
                          >
                            Buy
                          </LoadingButton>
                        </span>
                      </CustomToolTip>
                    </TableCell>
                    <TableCell className="txt-s">
                      <CustomToolTip disabled={!isOperator} title="You are not the operator">
                        <span>
                          <LoadingButton
                            className="btn bg--danger txt-p-vault txt-dddbld text--white test"
                            disabled={!isOperator}
                            onClick={() => this.onSellClick(key)}
                          >
                            Sell
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
        <AlertModal open={buyModalOpen} handleClose={this.handleBuyModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <TextField label="Enter Ether Amount" value={buyInput} onChange={e => this.setState({ buyInput: e.target.value })} />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <LoadingButton onClick={this.getPriceClick}>Get Price</LoadingButton>
              </Col>
            </Row>
            {buyPrice && buyTradeData[buyToken] ? (
              <div>
                <Row className="push--bottom">
                  <Col lg={12}>
                    <div> Token Price: {buyPrice}</div>
                    <div>
                      {" "}
                      Receivable Tokens: {formatCurrencyNumber(formatFromWei(parseFloat(buyTradeData[buyToken].rate) * parseFloat(buyInput), 3))}{" "}
                      tokens
                    </div>
                  </Col>
                </Row>
                <Row className="push--bottom">
                  <Col lg={6}>
                    <Transaction
                      txHash={buyButtonTransactionHash}
                      buttonSpinning={buyButtonSpinning}
                      onClick={this.onBuyTokenClick}
                      buttonText="Buy"
                      success={buySuccess}
                    />
                  </Col>
                  <Col lg={6}>
                    <Transaction
                      txHash={transferButtonTransactionHash}
                      buttonSpinning={transferButtonSpinning}
                      onClick={this.onTransferTokenClick}
                      buttonText="Transfer"
                      success={transferSuccess}
                    />
                  </Col>
                </Row>
              </div>
            ) : null}
          </Grid>
        </AlertModal>
        <AlertModal open={sellModalOpen} handleClose={this.handleSellModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <TextField label="Enter Token Amount" value={sellInput} onChange={e => this.setState({ sellInput: e.target.value })} />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <LoadingButton onClick={this.getSellPriceClick}>Get Price</LoadingButton>
              </Col>
            </Row>
            {sellPrice && sellTradeData[sellToken] ? (
              <div>
                <Row className="push--bottom">
                  <Col lg={12}>
                    <div> Token Price: {sellPrice}</div>
                    <div>
                      {" "}
                      Receivable Dollars:{" "}
                      {formatMoney(formatFromWei(parseFloat(sellTradeData[sellToken].rate) * parseFloat(sellInput) * config.etherPrice, 3))}
                    </div>
                  </Col>
                </Row>
                <Row className="push--bottom">
                  <Col lg={4}>
                    <Transaction
                      txHash={transferFromButtonTransactionHash}
                      buttonSpinning={transferFromButtonSpinning}
                      onClick={this.onTransferFromTokenClick}
                      buttonText="Transfer"
                      success={transferFromSuccess}
                    />
                  </Col>
                  <Col lg={4}>
                    <Transaction
                      txHash={approveButtonTransactionHash}
                      buttonSpinning={approveButtonSpinning}
                      onClick={this.onApproveClick}
                      buttonText="Approve"
                      success={approveSuccess}
                    />
                  </Col>
                  <Col lg={4}>
                    <Transaction
                      txHash={sellButtonTransactionHash}
                      buttonSpinning={sellButtonSpinning}
                      onClick={this.onSellTokenClick}
                      buttonText="Sell"
                      success={sellSuccess}
                    />
                  </Col>
                </Row>
              </div>
            ) : null}
          </Grid>
        </AlertModal>
      </div>
    );
  }
}

BuyHoldingsTable.propTypes = {
  buyTokenAction: Proptypes.func.isRequired,
  sellTokenAction: Proptypes.func.isRequired,
  getBuyRate: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired,
  transferTokensToUser: Proptypes.func.isRequired,
  transferTokensFromUser: Proptypes.func.isRequired,
  approveTokenTransfer: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { tradeData, signinManagerData, userData } = state;
  const { tokenBalance } = userData || {};
  const {
    buyTradeData,
    sellTradeData,
    buyButtonSpinning,
    transferButtonSpinning,
    buyButtonTransactionHash,
    transferButtonTransactionHash,
    buySuccess,
    transferSuccess,
    sellButtonSpinning,
    transferFromButtonSpinning,
    sellButtonTransactionHash,
    transferFromButtonTransactionHash,
    sellSuccess,
    transferFromSuccess,
    approveSuccess,
    approveButtonTransactionHash,
    approveButtonSpinning
  } = tradeData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    buyTradeData,
    sellTradeData,
    userLocalPublicAddress,
    buyButtonSpinning,
    transferButtonSpinning,
    buyButtonTransactionHash,
    transferButtonTransactionHash,
    buySuccess,
    transferSuccess,
    sellButtonSpinning,
    transferFromButtonSpinning,
    sellButtonTransactionHash,
    transferFromButtonTransactionHash,
    sellSuccess,
    transferFromSuccess,
    approveSuccess,
    approveButtonTransactionHash,
    approveButtonSpinning,
    tokenBalance
  };
};

export default connect(
  mapStateToProps,
  { getBuyRate, getSellRate, buyTokenAction, sellTokenAction, transferTokensToUser, transferTokensFromUser, approveTokenTransfer }
)(BuyHoldingsTable);
