import React, { Component } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "../../components/common/FormComponents";
import { getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken, withdrawAction, setQtyStepFunction, setCompactData, setImbalanceStepFunction } from "../../actions/marketMakerActions";
import LoadingButton from "../../components/common/LoadingButton";
import TokenPriceTable from "../../components/common/TokenPriceTable";

class AutomatedReserveTable extends Component {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    // modifyRatesModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    token: "",
    modifyBuyPrice: "",
    modifySellPrice: ""
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  // handleModifyRatesModalOpen = () => this.setState({ modifyRatesModalOpen: true });

  // handleModifyRatesModalClose = () => this.setState({ modifyRatesModalOpen: false, modifyBuyPrice: "", modifySellPrice: "" });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false, depositTokenInput: "" });

  handleWithdrawTokenModalOpen = () => this.setState({ withdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ withdrawTokenModalOpen: false, withdrawTokenInput: "" });

  // onModifyRatesClick = key => this.setState({ modifyRatesModalOpen: true, token: key });

  onDepositClick = key => this.setState({ depositTokenModalOpen: true, token: key });

  onWithdrawClick = key => this.setState({ withdrawTokenModalOpen: true, token: key });

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { modifyBuyPrice, modifySellPrice, token } = this.state;
    modifyRatesAction(token, modifyBuyPrice, modifySellPrice, userLocalPublicAddress);
  };

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

  render() {
    const {
      tokenBalance,
      // isOperator,
      currentPortfolioValue,
      transferTokenButtonSpinning,
      transferTokenButtonTransactionHash,
      // transferTokenSuccess,
      withdrawTokenButtonSpinning,
      withdrawTokenButtonTransactionHash,
      // withdrawTokenSuccess,
      isOwner,
      buyPriceData,
      sellPriceData
      // modifyRatesButtonSpinning,
      // modifyRatesTransactionHash
    } = this.props || {};
    const {
      depositTokenModalOpen,
      depositTokenInput,
      withdrawTokenModalOpen,
      withdrawTokenInput
      // modifyRatesModalOpen,
      // modifyBuyPrice,
      // modifySellPrice
    } = this.state;
    return (
      <div>
        <TokenPriceTable
          buyPriceData={buyPriceData}
          sellPriceData={sellPriceData}
          currentPortfolioValue={currentPortfolioValue}
          tokenBalance={tokenBalance}
        />
        <Paper className="card-brdr push--ends">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad table-head-clr">Token Name</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad table-head-clr">Deposit</TableCell>
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad table-head-clr">Withdraw</TableCell>
                {/* <Table.HeaderCell>Modify Bid/Ask Prices</Table.HeaderCell> */}
                <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad table-head-clr">Etherscan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(tokenBalance).map(key => (
                <TableRow key={key}>
                  <TableCell className="txt-s fnt-ps table-text-pad">{config.tokens[key].name}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
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
                  <TableCell className="txt-s fnt-ps table-text-pad">
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
                  </TableCell>
                  {/* <TableCell verticalAlign="middle">
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
                </TableCell> */}
                  <TableCell className="txt-s fnt-ps table-text-pad">
                    <span>
                      <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                        View on Blockchain
                      </a>
                    </span>
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
        {/* <AlertModal open={modifyRatesModalOpen} handleClose={this.handleModifyRatesModalClose}>
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
        </AlertModal> */}
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

AutomatedReserveTable.propTypes = {
  depositToken: Proptypes.func.isRequired,
  withdrawAction: Proptypes.func.isRequired,
  setCompactData: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken, withdrawAction, setQtyStepFunction, setCompactData, setImbalanceStepFunction }
)(AutomatedReserveTable);
