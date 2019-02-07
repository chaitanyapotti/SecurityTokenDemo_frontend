import React, { Component } from "react";
import { Table, Input, Divider } from "semantic-ui-react";
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
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Deposit</Table.HeaderCell>
              <Table.HeaderCell>Withdraw</Table.HeaderCell>
              <Table.HeaderCell>Modify Bid/Ask Prices</Table.HeaderCell>
              <Table.HeaderCell>Modify Step Prices</Table.HeaderCell>
              <Table.HeaderCell>Modify Imbalance Prices</Table.HeaderCell>
              <Table.HeaderCell>Etherscan</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(tokenBalance).map(key => (
              <Table.Row key={key}>
                <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
                <Table.Cell verticalAlign="middle">
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
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOwner} title="You are not the operator">
                    <span>
                      <LoadingButton
                        className="btn bg--danger txt-p-vault txt-dddbld text--white test"
                        disabled={!isOwner}
                        onClick={() => this.onWithdrawClick(key)}
                      >
                        Withdraw
                      </LoadingButton>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOperator} title="You are not the operator">
                    <span>
                      <LoadingButton
                        className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                        disabled={!isOperator}
                        onClick={() => this.onModifyRatesClick(key)}
                      >
                        Modify Prices
                      </LoadingButton>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOperator} title="You are not the operator">
                    <span>
                      <LoadingButton
                        className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                        disabled={!isOperator}
                        onClick={() => this.onTradeClick(key)}
                      >
                        Modify Step Price
                      </LoadingButton>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOperator} title="You are not the operator">
                    <span>
                      <LoadingButton
                        className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                        disabled={!isOperator}
                        onClick={() => this.onModifyImbalanceRatesClick(key)}
                      >
                        Modify Imbalance Prices
                      </LoadingButton>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell>
                  <span>
                    <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                      View on Blockchain
                    </a>
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AlertModal open={depositTokenModalOpen} handleClose={this.handleDepositTokenModalClose}>
          <Grid>
            <Row className="push--bottom">
              <Col lg={12}>
                <Input
                  placeholder="Enter No Of Tokens"
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
                <Input
                  placeholder="Enter No Of Tokens"
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
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {buyTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Quantity" value={item.rate} onChange={e => this.updateBuyArray(e, index, "rate")} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Percent" value={item.percent} onChange={e => this.updateBuyArray(e, index, "percent")} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Divider horizontal>Sell</Divider>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sellTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Sell Quantity" value={item.rate} onChange={e => this.updateSellArray(e, index, "rate")} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input placeholder="Enter Sell Percent" value={item.percent} onChange={e => this.updateSellArray(e, index, "percent")} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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
            <Divider horizontal>Buy</Divider>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {imbalanceBuyTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Quantity" value={item.rate} onChange={e => this.updateImbalanceBuyArray(e, index, "rate")} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Percent" value={item.percent} onChange={e => this.updateImbalanceBuyArray(e, index, "percent")} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Divider horizontal>Sell (Hi to Lo)</Divider>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {imbalanceSellTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Sell Quantity" value={item.rate} onChange={e => this.updateImbalanceSellArray(e, index, "rate")} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder="Enter Sell Percent"
                        value={item.percent}
                        onChange={e => this.updateImbalanceSellArray(e, index, "percent")}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Bid ($)</Table.HeaderCell>
                  <Table.HeaderCell>Ask ($)</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Input
                      placeholder="Enter Sell Price"
                      value={modifySellPrice}
                      onChange={e => this.setState({ modifySellPrice: e.target.value })}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input placeholder="Enter Buy Price" value={modifyBuyPrice} onChange={e => this.setState({ modifyBuyPrice: e.target.value })} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
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
