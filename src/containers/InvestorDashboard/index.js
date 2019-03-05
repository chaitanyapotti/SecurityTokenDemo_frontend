import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import CUICard from "../../components/CustomMUI/CUICard";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import { getPortfolioSelector } from "../../selectors";

class InvestorDashboard extends Component {
  componentWillMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status } = JSON.parse(localStorage.getItem("user_data")) || {};
    this.setState({ first_name, email, phone, id, role, date, status, publicAddress });
    fetchUserBalance(publicAddress);
    fetchTokenBalance(publicAddress);
  }

  render() {
    const { userBalance, tokenBalance, currentPortfolioValue } = this.props || {};
    const { first_name, email, phone, id, role, date, status, publicAddress } = this.state;
    if (tokenBalance[publicAddress] && currentPortfolioValue[publicAddress]) {
      return (
        <Grid container="true">
          <Navbar />
          <div style={{ marginTop: "100px" }}>
            <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
          </div>
          <CUICard style={{ marginTop: "10px" }}>
            <Row>
              <Col lg={8}>
                <div className="txt-m text--primary push-half--bottom push-top--35">
                  ETH Balance : <span className="txt-m text--secondary">{userBalance[publicAddress]}</span>
                </div>
                <div className="txt-m text--primary push-half--bottom">
                  Portfolio Value : <span className="txt-m text--secondary">{formatMoney(currentPortfolioValue[publicAddress].total, 0)}</span>
                </div>
              </Col>
            </Row>
          </CUICard>
          <HoldingsTable tokenBalance={tokenBalance[publicAddress]} currentPortfolioValue={currentPortfolioValue[publicAddress]} />
          <CUICard>
            <Row center="lg">
              <Col>
                <TokenChart tokenBalance={tokenBalance[publicAddress]} />
              </Col>
            </Row>
          </CUICard>
        </Grid>
      );
    }
    return <div />;
  }
}

InvestorDashboard.propTypes = {
  getUserBalanceAction: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData } = state;
  const { userBalance, tokenBalance } = userData || {};
  return {
    userBalance,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state)
  };
};

export default connect(
  mapStateToProps,
  { getUserBalanceAction, getTokenBalance }
)(InvestorDashboard);
