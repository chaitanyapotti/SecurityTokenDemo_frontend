import React, { Component } from "react";
import { Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange, depositEther } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import EtherScanHoldingsTable from "../../components/common/EtherScanHoldingsTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";
import { formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import AlertModal from "../../components/common/AlertModal";
import Transaction from "../../components/common/FormComponents/Transaction";
import { CustomToolTip } from "../../components/common/FormComponents";

class MarketMakerDashboard extends Component {
  componentWillMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status, reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
    const tokenOptions =
      Object.keys(config.tokens).map(x => ({
        key: config.tokens[x].name,
        value: config.tokens[x].address,
        text: config.tokens[x].name
      })) || {};
    this.setState({ first_name, email, phone, id, role, date, status, etherScanLink, tokenOptions, publicAddress });
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
  }

  state = {
    depositEtherModalOpen: false,
    depositEtherInput: ""
  };

  handleDepositEtherModalOpen = () => this.setState({ depositEtherModalOpen: true });

  handleDepositEtherModalClose = () => this.setState({ depositEtherModalOpen: false });

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
    this.setState({ depositEtherModalOpen: true, depositEtherInput: "" });
  };

  depositClick = e => {
    const { depositEther: deposit } = this.props;
    const { reserveAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    const { userLocalPublicAddress } = this.props || {};
    const { depositEtherInput } = this.state;
    deposit(depositEtherInput, reserveAddress, userLocalPublicAddress);
  };

  render() {
    const {
      userBalance,
      tokenBalance,
      portfolioValue,
      userLocalPublicAddress,
      depositEtherButtonSpinning,
      depositEtherButtonTransactionHash,
      depositEtherSuccess
    } = this.props || {};
    const { first_name, email, phone, id, role, date, status, publicAddress, etherScanLink, depositEtherInput, depositEtherModalOpen } = this.state;
    const isOperator = userLocalPublicAddress === publicAddress;
    const isOwner = userLocalPublicAddress === config.owner;
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
                Reserve ETH Balance : <span className="txt-m text--secondary">{userBalance}</span>
              </div>
              <div className="txt-m text--primary push-half--bottom">
                Reserve Portfolio Value : <span className="txt-m text--secondary">{formatMoney(portfolioValue, 0)}</span>
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
            <Col lg={12}>
              <CustomToolTip disabled={!isOperator} title="You are not the operator">
                <span>
                  <Button
                    className="btn bg--primary txt-p-vault txt-dddbld text--white test"
                    disabled={!isOperator}
                    onClick={this.onDepositEtherClick}
                  >
                    Deposit Ether
                  </Button>
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

        <EtherScanHoldingsTable tokenBalance={tokenBalance} isOperator={isOperator} isOwner={isOwner} />

        <CUICard>
          <Row center="lg">
            <Col>
              <TokenChart tokenBalance={tokenBalance} />
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
      </Grid>
    );
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  depositEther: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData, signinManagerData } = state;
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  const { dropDownSelect, depositEtherButtonSpinning, depositEtherButtonTransactionHash, depositEtherSuccess } = marketMakerData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue,
    dropDownSelect,
    userLocalPublicAddress,
    depositEtherButtonSpinning,
    depositEtherButtonTransactionHash,
    depositEtherSuccess
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance, getUserBalanceAction, depositEther }
)(MarketMakerDashboard);
