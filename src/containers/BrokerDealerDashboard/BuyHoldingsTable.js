import React, { Component } from "react";
import { Table, Button, Input, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { formatCurrencyNumber, formatMoney, formatFromWei } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import LoadingButton from "../../components/common/LoadingButton";
import { getBuyRate, getSellRate, buyTokenAction, transferTokensToUser, transferTokensFromUser } from "../../actions/tradeActions";
import { CustomToolTip } from "../../components/common/FormComponents";
import Transaction from "../../components/common/FormComponents/Transaction";

class BuyHoldingsTable extends Component {
  state = {
    buyModalOpen: false,
    sellModalOpen: false,
    buyInput: "",
    buyToken: ""
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

  onSellClick = () => {
    this.setState({ sellModalOpen: true });
  };

  getPriceClick = () => {
    const { getBuyRate: fetchBuyRate } = this.props;
    const { buyToken, buyInput } = this.state;
    fetchBuyRate(buyToken, buyInput);
  };

  onTransferTokenClick = () => {
    const { transferTokensToUser: transfer } = this.props;
    const { buyTradeData, userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { buyToken, buyInput } = this.state;
    const tokenCount = parseFloat(buyTradeData[buyToken].rate) * parseFloat(buyInput);
    transfer(buyToken, Math.round(tokenCount).toString(), userLocalPublicAddress, dropDownSelect);
  };

  render() {
    const {
      tokenBalance,
      buyTradeData,
      buyButtonSpinning,
      transferButtonSpinning,
      userLocalPublicAddress,
      publicAddress,
      buyButtonTransactionHash,
      transferButtonTransactionHash,
      buySuccess,
      transferSuccess
    } = this.props || {};
    console.log(buyButtonSpinning, "spin");
    const { buyModalOpen, sellModalOpen, buyInput, buyToken } = this.state;
    const buyPrice = buyTradeData && buyTradeData[buyToken] ? buyTradeData[buyToken].price : 0;
    const isOperator = userLocalPublicAddress === publicAddress;
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
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
                      <Button className="btn bg--danger txt-p-vault txt-dddbld text--white test" disabled={!isOperator} onClick={this.onSellClick}>
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
                      buttonText="transfer"
                      success={transferSuccess}
                    />
                  </Col>
                </Row>
              </div>
            ) : null}
          </Grid>
        </AlertModal>
        <AlertModal open={sellModalOpen} handleClose={this.handleSellModalClose} />
      </div>
    );
  }
}

BuyHoldingsTable.propTypes = {
  buyTokenAction: Proptypes.func.isRequired,
  getBuyRate: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired,
  transferTokensToUser: Proptypes.func.isRequired,
  transferTokensFromUser: Proptypes.func.isRequired
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
    transferSuccess
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
    transferSuccess
  };
};

export default connect(
  mapStateToProps,
  { getBuyRate, getSellRate, buyTokenAction, transferTokensToUser, transferTokensFromUser }
)(BuyHoldingsTable);
