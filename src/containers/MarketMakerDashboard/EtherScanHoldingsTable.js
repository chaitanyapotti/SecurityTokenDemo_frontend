import React, { Component } from "react";
import { Table, Input, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "../../components/common/FormComponents";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken, withdrawAction, setQtyStepFunction } from "../../actions/marketMakerActions";
import LoadingButton from "../../components/common/LoadingButton";

class EtherScanHoldingsTable extends Component {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    token: "",
    tradeModalOpen: false,
    buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
    sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  handleTradeModalOpen = () => this.setState({ tradeModalOpen: true });

  handleTradeModalClose = () =>
    this.setState({
      tradeModalOpen: false,
      sellTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }],
      buyTradeData: [{ rate: "", percent: "" }, { rate: "", percent: "" }, { rate: "", percent: "" }]
    });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false, depositTokenInput: "" });

  handleWithdrawTokenModalOpen = () => this.setState({ withdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ withdrawTokenModalOpen: false, withdrawTokenInput: "" });

  onDepositClick = key => {
    this.setState({ depositTokenModalOpen: true, token: key });
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
      transferTokenSuccess,
      withdrawTokenButtonSpinning,
      withdrawTokenButtonTransactionHash,
      withdrawTokenSuccess,
      isOwner,
      tradeSuccess,
      tradeButtonSpinning,
      tradeButtonTransactionHash
    } = this.props || {};
    const {
      depositTokenModalOpen,
      depositTokenInput,
      withdrawTokenModalOpen,
      withdrawTokenInput,
      tradeModalOpen,
      buyTradeData,
      sellTradeData
    } = this.state;
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
              <Table.HeaderCell>Deposit</Table.HeaderCell>
              <Table.HeaderCell>Withdraw</Table.HeaderCell>
              <Table.HeaderCell>Trade</Table.HeaderCell>
              <Table.HeaderCell>Etherscan</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(tokenBalance).map(key => (
              <Table.Row key={key}>
                <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatMoney(currentPortfolioValue[key], 0)}</Table.Cell>
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
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
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
                  success={transferTokenSuccess}
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
                  success={withdrawTokenSuccess}
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
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {buyTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Price" value={item.rate} onChange={e => this.updateBuyArray(e, index, "rate")} />
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
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sellTradeData.map((item, index) => (
                  // eslint-disable-next-line
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Input placeholder="Enter Sell Price" value={item.rate} onChange={e => this.updateSellArray(e, index, "rate")} />
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
                  success={tradeSuccess}
                  txHash={tradeButtonTransactionHash}
                  buttonSpinning={tradeButtonSpinning}
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
  const { marketMakerData, signinManagerData } = state;
  const {
    transferTokenButtonSpinning,
    transferTokenButtonTransactionHash,
    transferTokenSuccess,
    withdrawTokenButtonSpinning,
    withdrawTokenButtonTransactionHash,
    withdrawTokenSuccess,
    tradeSuccess,
    tradeButtonSpinning,
    tradeButtonTransactionHash
  } = marketMakerData || {};
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
    tradeButtonTransactionHash
  };
};

EtherScanHoldingsTable.propTypes = {
  depositToken: Proptypes.func.isRequired,
  withdrawAction: Proptypes.func.isRequired,
  setQtyStepFunction: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken, withdrawAction, setQtyStepFunction }
)(EtherScanHoldingsTable);
