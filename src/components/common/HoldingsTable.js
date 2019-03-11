import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, formatFromWei } from "../../helpers/numberHelpers";
import config from "../../config";
import { CustomToolTip } from "./FormComponents";
import LoadingButton from "./LoadingButton";
import AlertModal from "./AlertModal";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import Transaction from "./FormComponents/Transaction";
import { getBuyRate, getSellRate, buyTokenAction, sellTokenAction, approveTokenTransfer } from "../../actions/tradeActions";

class HoldingsTable extends PureComponent {
  state = {
    buyModalOpen: false,
    sellModalOpen: false,
    buyInput: "",
    buyToken: "",
    sellToken: "",
    sellInput: ""
  };

  onBuyClick = key => {
    this.setState({ buyModalOpen: true, buyToken: key });
  };

  onSellClick = key => {
    this.setState({ sellModalOpen: true, sellToken: key });
  };

  handleBuyModalClose = () => this.setState({ buyModalOpen: false });

  handleSellModalClose = () => this.setState({ sellModalOpen: false });

  getPriceClick = () => {
    const { getBuyRate: fetchBuyRate } = this.props;
    const { buyToken, buyInput } = this.state;
    fetchBuyRate(buyToken, buyInput);
  };

  onBuyTokenClick = () => {
    const { buyTokenAction: doBuyToken } = this.props;
    const { buyTradeData, userLocalPublicAddress, dropDownSelect } = this.props || {};
    const { buyToken, buyInput } = this.state;
    doBuyToken(buyToken, buyInput, userLocalPublicAddress, buyTradeData[buyToken].rate, dropDownSelect);
  };

  getSellPriceClick = () => {
    const { getSellRate: fetchSellRate } = this.props;
    const { sellToken, sellInput } = this.state;
    fetchSellRate(sellToken, sellInput);
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

  render() {
    const {
      tokenBalance,
      currentPortfolioValue,
      isOperator,
      buyTradeData,
      sellTradeData,
      buyButtonTransactionHash,
      buyButtonSpinning,
      buySuccess,
      sellButtonSpinning,
      sellButtonTransactionHash,
      sellSuccess,
      approveButtonSpinning,
      approveButtonTransactionHash,
      approveSuccess
    } = this.props || {};
    const { buyModalOpen, sellModalOpen, buyInput, buyToken, sellInput, sellToken } = this.state;
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
    return (
      <div>
        <Paper className="card-brdr push--ends">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Name</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Count</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Invested Value($)</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Current Value($)</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Change</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Price</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">EtherScan</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Buy</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Sell</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(tokenBalance).map(key => (
                <TableRow key={key}>
                  <TableCell className="txt-s fnt-ps table-text-pad">{config.tokens[key].name}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{formatMoney(tokenBalance[key].dollarValue, 0)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
                    {`+${formatMoney(currentPortfolioValue[key] - tokenBalance[key].dollarValue, 0)}(+${Math.round(
                      ((currentPortfolioValue[key] - tokenBalance[key].dollarValue) * 100) / tokenBalance[key].dollarValue,
                      2
                    )}%)`}
                  </TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
                    {formatMoney(currentPortfolioValue[key] / tokenBalance[key].balance || 0, 2)}
                  </TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
                    <span>
                      <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                        View on Blockchain
                      </a>
                    </span>
                  </TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
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
                  <TableCell className="txt-s fnt-ps table-text-pad">
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
              ))}
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

HoldingsTable.propTypes = {
  getBuyRate: Proptypes.func.isRequired,
  buyTokenAction: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired,
  sellTokenAction: Proptypes.func.isRequired,
  approveTokenTransfer: Proptypes.func.isRequired
};

export default connect(
  null,
  { getBuyRate, buyTokenAction, getSellRate, sellTokenAction, approveTokenTransfer }
)(HoldingsTable);
