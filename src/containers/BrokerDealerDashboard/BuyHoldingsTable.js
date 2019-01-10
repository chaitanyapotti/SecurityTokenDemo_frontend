import React, { Component } from "react";
import { Table, Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { formatCurrencyNumber, formatMoney, formatFromWei } from "../../helpers/numberHelpers";
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
    const { buyTradeData, userLocalPublicAddress } = this.props || {};
    const { buyToken, buyInput } = this.state;
    doBuyToken(buyToken, buyInput, userLocalPublicAddress, buyTradeData[buyToken].rate);
  };

  onSellClick = key => {
    this.setState({ sellModalOpen: true, sellToken: key });
  };

  onSellTokenClick = () => {
    const { sellTokenAction: doSellToken } = this.props;
    const { sellTradeData, userLocalPublicAddress } = this.props || {};
    const { sellToken, sellInput } = this.state;
    doSellToken(sellToken, sellInput, userLocalPublicAddress, sellTradeData[sellToken].rate);
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
      priceHistory
    } = this.props || {};
    const { buyModalOpen, sellModalOpen, buyInput, buyToken, sellInput, sellToken } = this.state;
    const buyPrice = buyTradeData && buyTradeData[buyToken] ? buyTradeData[buyToken].price : 0;
    const sellPrice = sellTradeData && sellTradeData[sellToken] ? sellTradeData[sellToken].price : 0;
    const isOperator = userLocalPublicAddress === publicAddress;
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Invested Value(USD)</Table.HeaderCell>
              <Table.HeaderCell>Current Value(USD)</Table.HeaderCell>
              <Table.HeaderCell>Change</Table.HeaderCell>
              <Table.HeaderCell>Buy</Table.HeaderCell>
              <Table.HeaderCell>Sell</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(tokenBalance).map(key => (
              <Table.Row key={key}>
                <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {formatMoney(tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice, 0)}
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {`+${formatMoney(
                    tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice - tokenBalance[key].dollarValue,
                    0
                  )}(+${Math.round(
                    ((tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice - tokenBalance[key].dollarValue) * 100) /
                      tokenBalance[key].dollarValue,
                    2
                  )}%)`}
                </Table.Cell>
                <Table.Cell>
                  <CustomToolTip disabled={!isOperator} title="You are not the operator">
                    <span>
                      <Button
                        className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                        disabled={!isOperator}
                        onClick={() => this.onBuyClick(key)}
                      >
                        Buy
                      </Button>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell>
                  <CustomToolTip disabled={!isOperator} title="You are not the operator">
                    <span>
                      <Button
                        className="btn bg--danger txt-p-vault txt-dddbld text--white test"
                        disabled={!isOperator}
                        onClick={() => this.onSellClick(key)}
                      >
                        Sell
                      </Button>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AlertModal open={buyModalOpen} handleClose={this.handleBuyModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <Input placeholder="Enter Ether Amount" value={buyInput} onChange={e => this.setState({ buyInput: e.target.value })} />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <LoadingButton onClick={this.getPriceClick}>Get Price</LoadingButton>
              </Col>
            </Row>
            {buyPrice > 0 ? (
              <div>
                <Row className="push--bottom">
                  <Col lg={12}>
                    <div> Token Price: {buyPrice} ETH/token</div>
                    <div> Receivable Tokens: {formatFromWei(parseFloat(buyTradeData[buyToken].rate) * parseFloat(buyInput), 3)} tokens</div>
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
                <Input placeholder="Enter Token Amount" value={sellInput} onChange={e => this.setState({ sellInput: e.target.value })} />
              </Col>
            </Row>
            <Row className="push--bottom">
              <Col lg={12}>
                <LoadingButton onClick={this.getSellPriceClick}>Get Price</LoadingButton>
              </Col>
            </Row>
            {sellPrice > 0 ? (
              <div>
                <Row className="push--bottom">
                  <Col lg={12}>
                    <div> Token Price: {sellPrice} tokens/ETH</div>
                    <div> Receivable Ether: {formatFromWei(parseFloat(sellTradeData[sellToken].rate) * parseFloat(sellInput), 3)} ETH</div>
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
  const { tradeData, signinManagerData } = state;
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
  } = tradeData;
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
    approveButtonSpinning
  };
};

export default connect(
  mapStateToProps,
  { getBuyRate, getSellRate, buyTokenAction, sellTokenAction, transferTokensToUser, transferTokensFromUser, approveTokenTransfer }
)(BuyHoldingsTable);
