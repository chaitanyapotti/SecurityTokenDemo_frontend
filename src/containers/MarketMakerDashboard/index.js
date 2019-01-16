import React, { Component } from "react";
import { Input, Table } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import LoadingButton from "../../components/common/LoadingButton";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange, depositEther, setCompactData, setQtyStepFunction } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import EtherScanHoldingsTable from "./EtherScanHoldingsTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";
import { formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { CustomToolTip } from "../../components/common/FormComponents";
import { getPortfolioSelector } from "../../selectors";

class MarketMakerDashboard extends Component {
  componentWillMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status, reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
    this.setState({ first_name, email, phone, id, role, date, status, etherScanLink, publicAddress, reserveAddress });
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
  }

  state = {
    depositEtherModalOpen: false,
    modifyRatesModalOpen: false,
    depositEtherInput: "",
    LMDBuyPercent: "",
    RIVBuyPercent: "",
    LMDSellPercent: "",
    RIVSellPercent: ""
  };

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  handleModifyRatesModalOpen = () => this.setState({ modifyRatesModalOpen: true });

  handleModifyRatesModalClose = () =>
    this.setState({ modifyRatesModalOpen: false, LMDBuyPercent: "", LMDSellPercent: "", RIVBuyPercent: "", RIVSellPercent: "" });

  handleDepositEtherModalClose = () => this.setState({ depositEtherModalOpen: false, depositEtherInput: "" });

  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  onDepositEtherClick = e => {
    this.setState({ depositEtherModalOpen: true });
  };

  onModifyRatesClick = e => {
    this.setState({ modifyRatesModalOpen: true });
  };

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    modifyRatesAction();
  };

  depositClick = e => {
    const { depositEther: deposit } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { depositEtherInput, reserveAddress } = this.state;
    deposit(depositEtherInput, reserveAddress, userLocalPublicAddress);
  };

  render() {
    const {
      userBalance,
      tokenBalance,
      currentPortfolioValue,
      userLocalPublicAddress,
      depositEtherButtonSpinning,
      depositEtherButtonTransactionHash,
      depositEtherSuccess,
      modifyRatesButtonSpinning,
      modifyRatesTransactionHash,
      tradeButtonSpinning,
      tradeButtonTransactionHash,
      modifyRatesSuccess,
      tradeSuccess
    } = this.props || {};
    const {
      first_name,
      email,
      phone,
      id,
      role,
      date,
      status,
      publicAddress,
      etherScanLink,
      depositEtherInput,
      depositEtherModalOpen,
      modifyRatesModalOpen,
      reserveAddress,
      LMDBuyPercent,
      RIVBuyPercent,
      LMDSellPercent,
      RIVSellPercent
    } = this.state;
    const isOperator = userLocalPublicAddress === publicAddress;
    const isOwner = userLocalPublicAddress === config.owner;
    if (tokenBalance[reserveAddress] && currentPortfolioValue[reserveAddress]) {
      return (
        <Grid container="true">
          <Navbar />
          <div style={{ marginTop: "100px" }}>
            <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
          </div>
          <CUICard style={{ marginTop: "10px" }}>
            <Row>
              <Col lg={8}>
                <div className="txt-m text--primary push-half--bottom  push-top--35">
                  Reserve ETH Balance : <span className="txt-m text--secondary">{userBalance[reserveAddress]}</span>
                </div>
                <div className="txt-m text--primary push-half--bottom">
                  Reserve Portfolio Value :{" "}
                  <span className="txt-m text--secondary">{formatMoney(currentPortfolioValue[reserveAddress].total, 0)}</span>
                </div>
              </Col>
              <Col lg={2} xsOffset={2}>
                {/* <Button className="btn bg--danger txt-p-vault txt-dddbld text--white push--bottom" onClick={this.onLogoutClick}>
                Logout
              </Button> */}
                <a href={etherScanLink} target="_blank" rel="noopener noreferrer">
                  View Reserve on Blockchain
                </a>
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <CustomToolTip disabled={!isOperator} title="You are not the operator">
                  <span>
                    <LoadingButton
                      className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                      disabled={!isOperator}
                      onClick={this.onDepositEtherClick}
                    >
                      Deposit Ether
                    </LoadingButton>
                  </span>
                </CustomToolTip>
              </Col>
              <Col lg={2}>
                <CustomToolTip disabled={!isOperator} title="You are not the operator">
                  <span>
                    <LoadingButton
                      className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                      className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                      disabled={!isOperator}
                      onClick={this.onModifyRatesClick}
                    >
                      Modify Rates
                    </LoadingButton>
                  </span>
                </CustomToolTip>
              </Col>
            </Row>
          </CUICard>
          {/* <CUICard>
          <Row>
            <Col lg={8}>
              <span className="txt-m text--primary push--bottom">
                Select Token :{" "}
                <Dropdown className="txt-s" onChange={this.onDropdownChange} selection placeholder="Select Token" options={tokenOptions} />
              </span>
            </Col>
            <Col lg={4} />
          </Row>
          {dropDownSelect ? (
            <Row>
              <Col />
            </Row>
          ) : null}
        </CUICard> */}

          <EtherScanHoldingsTable
            tokenBalance={tokenBalance[reserveAddress]}
            currentPortfolioValue={currentPortfolioValue[reserveAddress]}
            isOperator={isOperator}
            isOwner={isOwner}
            tradeButtonSpinning={tradeButtonSpinning}
            tradeButtonTransactionHash={tradeButtonTransactionHash}
            tradeSuccess={tradeSuccess}
          />

          <CUICard>
            <Row center="lg">
              <Col>
                <TokenChart tokenBalance={tokenBalance[reserveAddress]} />
              </Col>
            </Row>
          </CUICard>
          <AlertModal open={depositEtherModalOpen} handleClose={this.handleDepositEtherModalClose}>
            <Grid>
              <Row className="push--bottom">
                <Col lg={12}>
                  <Input
                    placeholder="Enter Ether Amount"
                    value={depositEtherInput}
                    onChange={e => this.setState({ depositEtherInput: e.target.value })}
                  />
                </Col>
              </Row>
              <Row className="push--bottom">
                <Col lg={12}>
                  <Transaction
                    onClick={this.depositClick}
                    buttonText="Deposit"
                    success={depositEtherSuccess}
                    txHash={depositEtherButtonTransactionHash}
                    buttonSpinning={depositEtherButtonSpinning}
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
                    <Table.HeaderCell>Token</Table.HeaderCell>
                    <Table.HeaderCell>Buy(%)</Table.HeaderCell>
                    <Table.HeaderCell>Sell(%)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>LMD</Table.Cell>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Percent" value={LMDBuyPercent} onChange={e => this.setState({ LMDBuyPercent: e.target.value })} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder="Enter Sell Percent"
                        value={LMDSellPercent}
                        onChange={e => this.setState({ LMDSellPercent: e.target.value })}
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>RIV</Table.Cell>
                    <Table.Cell>
                      <Input placeholder="Enter Buy Percent" value={RIVBuyPercent} onChange={e => this.setState({ RIVBuyPercent: e.target.value })} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder="Enter Sell Percent"
                        value={RIVSellPercent}
                        onChange={e => this.setState({ RIVSellPercent: e.target.value })}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Row className="push--bottom">
                <Col lg={9} />
                <Col lg={3}>
                  <Transaction
                    buttonText="Modify"
                    onClick={this.ModifyClick}
                    txHash={modifyRatesTransactionHash}
                    success={modifyRatesSuccess}
                    buttonSpinning={modifyRatesButtonSpinning}
                  />
                </Col>
              </Row>
            </Grid>
          </AlertModal>
        </Grid>
      );
    }
    return <div />;
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  depositEther: Proptypes.func.isRequired,
  setCompactData: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData, signinManagerData } = state;
  const { userBalance, tokenBalance } = userData || {};
  const {
    dropDownSelect,
    depositEtherButtonSpinning,
    depositEtherButtonTransactionHash,
    depositEtherSuccess,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash,
    tradeButtonSpinning,
    tradeButtonTransactionHash,
    modifyRatesSuccess,
    tradeSuccess
  } = marketMakerData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    userBalance,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state),
    dropDownSelect,
    userLocalPublicAddress,
    depositEtherButtonSpinning,
    depositEtherButtonTransactionHash,
    depositEtherSuccess,
    modifyRatesButtonSpinning,
    modifyRatesTransactionHash,
    tradeButtonSpinning,
    tradeButtonTransactionHash,
    modifyRatesSuccess,
    tradeSuccess
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance, getUserBalanceAction, depositEther, setCompactData, setQtyStepFunction }
)(MarketMakerDashboard);
