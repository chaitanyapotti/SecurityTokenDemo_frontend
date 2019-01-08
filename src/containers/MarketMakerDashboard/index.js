import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import TokenChart from "../../components/common/TokenChart";
import EtherScanHoldingsTable from "../../components/common/EtherScanHoldingsTable";
import config from "../../config";
import CUICard from "../../components/CustomMUI/CUICard";
import { formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";

class MarketMakerDashboard extends Component {
  constructor(props) {
    super(props);
    this.tokenOptions =
      Object.keys(config.tokens).map(x => ({
        key: config.tokens[x].name,
        value: config.tokens[x].address,
        text: config.tokens[x].name
      })) || {};
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { reserveAddress, publicAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    this.publicAddress = publicAddress;
    fetchUserBalance(reserveAddress);
    fetchTokenBalance(reserveAddress);
    this.etherScanLink = getEtherScanAddressLink(reserveAddress, "rinkeby");
  }

  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  render() {
    const { userBalance, tokenBalance, portfolioValue, dropDownSelect, userLocalPublicAddress } = this.props || {};
    const isOperator = userLocalPublicAddress === this.publicAddress;
    const { first_name, email, phone, id, role, date, status } = JSON.parse(localStorage.getItem("user_data")) || {};
    return (
      <Grid container="true">
        <Navbar />
        <div style={{ marginTop: "100px" }}>
          <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
        </div>
        <CUICard style={{ marginTop: "10px" }}>
          <Row>
            <Col lg={8}>
              <div className="txt-xxxl text--primary">
                Role : <span className="txt-xxxl txt-m text--secondary">Market Maker</span>
              </div>
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
              <a className="btn bg--primary txt-p-vault txt-dddbld text--white" href={this.etherScanLink} target="_blank" rel="noopener noreferrer">
                View Reserve on Etherscan
              </a>
            </Col>
          </Row>
        </CUICard>
        {isOperator ? <div /> : null}
        {/* <CUICard>
          <Row>
            <Col lg={8}>
              <span className="txt-m text--primary push--bottom">
                Select Token :{" "}
                <Dropdown className="txt-s" onChange={this.onDropdownChange} selection placeholder="Select Token" options={this.tokenOptions} />
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

        <EtherScanHoldingsTable tokenBalance={tokenBalance} isOperator={isOperator} />

        <CUICard>
          <Row center="lg">
            <Col>
              <TokenChart tokenBalance={tokenBalance} />
            </Col>
          </Row>
        </CUICard>
      </Grid>
    );
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, marketMakerData, signinManagerData } = state;
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  const { userLocalPublicAddress } = signinManagerData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue,
    dropDownSelect,
    userLocalPublicAddress
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance, getUserBalanceAction }
)(MarketMakerDashboard);
