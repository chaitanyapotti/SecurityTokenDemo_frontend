import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { stat } from "fs";
import CUICard from "../../components/CustomMUI/CUICard";
import { logoutUserAction } from "../../actions/authActions";
import { getPriceHistory } from "../../actions/priceHistoryActions";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";
import { getPortfolioSelector } from "../../selectors";

class InvestorDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  componentWillMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance, getPriceHistory: fetchPriceHistory } = this.props;
    const { publicAddress, first_name, email, phone, id, role, date, status } = JSON.parse(localStorage.getItem("user_data")) || {};
    this.setState({ first_name, email, phone, id, role, date, status });
    fetchPriceHistory();
    fetchUserBalance(publicAddress);
    fetchTokenBalance(publicAddress);
  }

  render() {
    const { userBalance, tokenBalance, portfolioValue, priceHistory } = this.props || {};
    const { first_name, email, phone, id, role, date, status } = this.state;
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
                ETH Balance : <span className="txt-m text--secondary">{userBalance}</span>
              </div>
              <div className="txt-m text--primary push-half--bottom">
                Portfolio Value : <span className="txt-m text--secondary">{formatMoney(portfolioValue, 0)}</span>
              </div>
            </Col>
            {/* <Col lg={2} xsOffset={2}>
              <Button className="btn bg--danger txt-p-vault txt-dddbld text--white" onClick={this.onLogoutClick}>
                Logout
              </Button>
            </Col> */}
          </Row>
        </CUICard>
        <HoldingsTable tokenBalance={tokenBalance} priceHistory={priceHistory} />
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

InvestorDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  getUserBalanceAction: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired,
  getPriceHistory: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, priceHistoryData } = state;
  const { userBalance, tokenBalance } = userData || {};
  const { priceHistory } = priceHistoryData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue: getPortfolioSelector(state),
    priceHistory
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getUserBalanceAction, getTokenBalance, getPriceHistory }
)(InvestorDashboard);
