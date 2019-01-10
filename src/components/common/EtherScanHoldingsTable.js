import React, { PureComponent } from "react";
import { Table, Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CustomToolTip } from "./FormComponents";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "./AlertModal";
import Transaction from "./FormComponents/Transaction";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { depositToken } from "../../actions/marketMakerActions";

class EtherScanHoldingsTable extends PureComponent {
  state = {
    depositTokenModalOpen: false,
    withdrawTokenModalOpen: false,
    depositEtherModalOpen: false,
    withdrawEtherModalOpen: false,
    depositTokenInput: "",
    withdrawTokenInput: "",
    depositEtherInput: "",
    token: "",
    withdrawEtherInput: ""
  };

  handleDepositTokenModalOpen = () => this.setState({ depositTokenModalOpen: true });

  handleDepositTokenModalClose = () => this.setState({ depositTokenModalOpen: false });

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  handleDepositEtherModalClose = () => this.setState({ depositEtherModalOpen: false });

  handleWithdrawTokenModalOpen = () => this.setState({ WithdrawTokenModalOpen: true });

  handleWithdrawTokenModalClose = () => this.setState({ WithdrawTokenModalOpen: false });

  handleWithdrawEtherModalOpen = () => this.setState({ WithdrawEtherModalOpen: true });

  handleWithdrawEtherModalClose = () => this.setState({ WithdrawEtherModalOpen: false });

  onDepositClick = key => {
    this.setState({ depositTokenModalOpen: true, token: key });
  };

  depositTokenClick = e => {
    const { depositToken: doDepositToken } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { token, depositTokenInput } = this.state;

    doDepositToken(depositTokenInput, token, reserveAddress, userLocalPublicAddress);
  };

  render() {
    const { tokenBalance, isOperator, transferTokenButtonSpinning, transferTokenButtonTransactionHash, transferTokenSuccess, isOwner } =
      this.props || {};
    const { depositTokenModalOpen, depositTokenInput } = this.state;
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
                <Table.Cell verticalAlign="middle">{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOwner} title="You are not the owner">
                    <span>
                      <Button
                        className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                        disabled={!isOwner}
                        onClick={() => this.onDepositClick(key)}
                      >
                        Deposit
                      </Button>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  <CustomToolTip disabled={!isOwner} title="You are not the owner">
                    <span>
                      <Button className="btn bg--danger txt-p-vault txt-dddbld text--white test" disabled={!isOwner} onClick={this.onWithdrawClick}>
                        Withdraw
                      </Button>
                    </span>
                  </CustomToolTip>
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {!isOperator ? (
                    <CustomToolTip disabled={!isOperator} title="You are not the operator">
                      <span>
                        <Button
                          className="btn bg--pending txt-p-vault txt-dddbld text--white test"
                          disabled={!isOperator}
                          onClick={this.onTradeClick}
                        >
                          Trade
                        </Button>
                      </span>
                    </CustomToolTip>
                  ) : (
                    <CustomToolTip disabled title="Trade is enabled in a desktop application mode">
                      <span>
                        <Button className="btn bg--pending txt-p-vault txt-dddbld text--white test" disabled onClick={this.onTradeClick}>
                          Trade
                        </Button>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { marketMakerData, signinManagerData } = state;
  const { transferTokenButtonSpinning, transferTokenButtonTransactionHash, transferTokenSuccess } = marketMakerData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    transferTokenButtonSpinning,
    transferTokenButtonTransactionHash,
    transferTokenSuccess,
    userLocalPublicAddress
  };
};

EtherScanHoldingsTable.propTypes = {
  depositToken: Proptypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { depositToken }
)(EtherScanHoldingsTable);
