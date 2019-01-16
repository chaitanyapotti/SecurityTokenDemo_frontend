import React, { Component } from "react";
import { Table, Input, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "../../components/common/FormComponents";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken, withdrawAction } from "../../actions/marketMakerActions";
import LoadingButton from "../../components/common/LoadingButton";

class EtherScanHoldingsTable extends Component {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    token: "",
    tradeModalOpen: false
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  handleTradeModalOpen = () => this.setState({ tradeModalOpen: true });

  handleTradeModalClose = () => this.setState({ tradeModalOpen: false });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false, depositTokenInput: "" });

  handleWithdrawTokenModalOpen = () => this.setState({ withdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ withdrawTokenModalOpen: false, withdrawTokenInput: "" });

  onDepositClick = key => {
    this.setState({ depositTokenModalOpen: true, token: key });
  };

  onWithdrawClick = key => {
    this.setState({ withdrawTokenModalOpen: true, token: key });
  };

  onTradeClick = e => {
    this.setState({ tradeModalOpen: true });
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
      tradeButtonSpinning,
      tradeButtonTransactionHash,
      tradeSuccess
    } = this.props || {};
    const { depositTokenModalOpen, depositTokenInput, withdrawTokenModalOpen, withdrawTokenInput, tradeModalOpen } = this.state;
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
                  {isOperator ? (
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <LoadingButton
                          className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={this.onTradeClick}
                        >
                          Trade
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  ) : (
                    <CustomToolTip title="Trade is enabled in a desktop application mode">
                      <span>
                        <LoadingButton className="btn bg--pending txt-p-vault txt-dddbld text--white test" onClick={this.onTradeClick}>
                          Trade
                        </LoadingButton>
                      </span>
                    </CustomToolTip>
                  )}
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
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Rate</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Divider horizontal>Sell</Divider>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Rate</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                  <Table.Cell>
                    <Input />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
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
    withdrawTokenSuccess
  } = marketMakerData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    transferTokenButtonSpinning,
    transferTokenButtonTransactionHash,
    transferTokenSuccess,
    userLocalPublicAddress,
    withdrawTokenButtonSpinning,
    withdrawTokenButtonTransactionHash,
    withdrawTokenSuccess
  };
};

EtherScanHoldingsTable.propTypes = {
  depositToken: Proptypes.func.isRequired,
  withdrawAction: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken, withdrawAction }
)(EtherScanHoldingsTable);
