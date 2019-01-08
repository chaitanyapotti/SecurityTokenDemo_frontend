import React, { Component } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import CUICard from "../../components/CustomMUI/CUICard";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance, getUserBalanceAction } from "../../actions/userActions";
import BuyHoldingsTable from "../../components/common/BuyHoldingsTable";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import AlertModal from "../../components/common/AlertModal";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";

class BrokerDealerDashboard extends Component {
  constructor(props) {
    super(props);
    this.tokenOptions =
      JSON.parse(localStorage.getItem("user_data")).investors.map(x => ({
        key: x.name,
        value: x.address,
        text: x.name
      })) || {};
  }

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange, getTokenBalance: fetchTokenBalance, getUserBalanceAction: fetchUserBalance } = this.props;
    dropDownChange(d.value);
    fetchTokenBalance(d.value);
    fetchUserBalance(d.value);
  };

  render() {
    const { dropDownSelect, tokenBalance, userBalance, portfolioValue } = this.props || {};
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
                Role : <span className="txt-xxxl txt-m text--secondary">Broker Dealer</span>
              </div>
              <div className="txt-m text--primary push--bottom push-top--35">
                Select Investor :{" "}
                <Dropdown className="txt-s" onChange={this.onDropdownChange} selection placeholder="Select Investor" options={this.tokenOptions} />
              </div>
              <div className="txt-m text--primary push-half--bottom">
                ETH Balance : <span className="txt-m text--secondary">{userBalance}</span>
              </div>
              <div className="txt-m text--primary push-half--bottom">
                Portfolio Value : <span className="txt-m text--secondary">{formatMoney(portfolioValue, 0)}</span>
              </div>
            </Col>
          </Row>
        </CUICard>
        {dropDownSelect ? <BuyHoldingsTable tokenBalance={tokenBalance} /> : null}
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

BrokerDealerDashboard.propTypes = {
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { marketMakerData, userData } = state;
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  const { dropDownSelect } = marketMakerData || {};
  return {
    dropDownSelect,
    tokenBalance,
    portfolioValue,
    userBalance
  };
};

export default connect(
  mapStateToProps,
  { onDropdownChange, getTokenBalance, getUserBalanceAction }
)(BrokerDealerDashboard);
