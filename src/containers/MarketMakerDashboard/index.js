import React, { Component } from "react";
import { Input, Table } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import LoadingButton from "../../components/common/LoadingButton";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange, depositEther, setCompactData, setQtyStepFunction } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { getBuyRate, getSellRate } from "../../actions/tradeActions";
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
    const {
      getUserBalanceAction: fetchUserBalance,
      getTokenBalance: fetchTokenBalance,
      getBuyRate: fetchBuyRate,
      getSellRate: fetchSellRate
    } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status, reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
    this.setState({ first_name, email, phone, id, role, date, status, etherScanLink, publicAddress, reserveAddress });
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
    Object.keys(config.tokens).forEach(x => {
      fetchBuyRate(x, 0.1);
      fetchSellRate(x, 10);
    });
  }

  state = {
    depositEtherModalOpen: false,
    modifyRatesModalOpen: false,
    depositEtherInput: "",
    buyPercent: { RIV: "", LMD: "" },
    sellPercent: { RIV: "", LMD: "" }
  };

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  

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

  

  onModifyClick = e => {
    const { setCompactData: modifyRatesAction } = this.props;
    const { userLocalPublicAddress } = this.props || {};
    const { buyPercent, sellPercent } = this.state;
    modifyRatesAction(Object.keys(buyPercent).map(i => buyPercent[i]), Object.keys(sellPercent).map(i => sellPercent[i]), userLocalPublicAddress);
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
      // depositEtherSuccess,
      modifyRatesButtonSpinning,
      modifyRatesTransactionHash
      // modifyRatesSuccess
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
      buyPercent,
      sellPercent
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
                    <Table.HeaderCell>Ask(%)</Table.HeaderCell>
                    <Table.HeaderCell>Bid(%)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Object.keys(config.tokens).map(key => (
                    <Table.Row key={key}>
                      <Table.Cell>{key}</Table.Cell>
                      <Table.Cell>
                        <Input
                          placeholder="Enter Sell Percent"
                          value={sellPercent[key]}
                          onChange={e => this.setState({ sellPercent: { ...sellPercent, [key]: e.target.value } })}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          placeholder="Enter Buy Percent"
                          value={buyPercent[key]}
                          onChange={e => this.setState({ buyPercent: { ...buyPercent, [key]: e.target.value } })}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Row className="push--bottom">
                <Col lgOffset={9} lg={3}>
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
  setCompactData: Proptypes.func.isRequired,
  getBuyRate: Proptypes.func.isRequired,
  getSellRate: Proptypes.func.isRequired
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
    modifyRatesSuccess
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
    modifyRatesSuccess
  };
};

export default connect(
  mapStateToProps,
  {
    logoutUserAction,
    onDropdownChange,
    getTokenBalance,
    getUserBalanceAction,
    depositEther,
    setCompactData,
    setQtyStepFunction,
    getBuyRate,
    getSellRate
  }
)(MarketMakerDashboard);
