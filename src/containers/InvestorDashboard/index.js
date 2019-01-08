import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { stat } from "fs";
import CUICard from "../../components/CustomMUI/CUICard";
import { logoutUserAction } from "../../actions/authActions";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";
import Navbar from "../Navbar";
import BioTable from "../../components/common/BioTable";

class InvestorDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  componentDidMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { publicAddress } = JSON.parse(localStorage.getItem("user_data")) || {};
    fetchUserBalance(publicAddress);
    fetchTokenBalance(publicAddress);
  }

  render() {
    const { userBalance, tokenBalance, portfolioValue } = this.props || {};
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
                Role : <span className="txt-xxxl txt-m text--secondary">Investor</span>
              </div>
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
        <HoldingsTable tokenBalance={tokenBalance} />
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
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData } = state;
  const { userBalance, tokenBalance, portfolioValue } = userData || {};
  return {
    userBalance,
    tokenBalance,
    portfolioValue
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getUserBalanceAction, getTokenBalance }
)(InvestorDashboard);
