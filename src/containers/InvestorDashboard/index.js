import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import CUICard from "../../components/CustomMUI/CUICard";
import { getUserBalanceAction, getTokenBalance } from "../../actions/userActions";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { formatMoney } from "../../helpers/numberHelpers";
import TokenChart from "../../components/common/TokenChart";
import HoldingsTable from "../../components/common/HoldingsTable";
import Navbar from "../Navbar";
import { getPortfolioSelector } from "../../selectors";

class InvestorDashboard extends Component {
  componentDidMount() {
    const { getUserBalanceAction: fetchUserBalance, getTokenBalance: fetchTokenBalance } = this.props;
    const { publicAddress } = this.props || {};
    fetchUserBalance(publicAddress);
    fetchTokenBalance(publicAddress);
  }

  render() {
    const { userBalance, tokenBalance, currentPortfolioValue } = this.props || {};
    const { publicAddress } = this.props || {};
    if (tokenBalance[publicAddress] && currentPortfolioValue[publicAddress]) {
      return (
        <Grid container="true">
          <Navbar />
          <CUICard style={{ marginTop: "100px" }}>
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
    return <CircularProgress />;
  }
}

InvestorDashboard.propTypes = {
  getUserBalanceAction: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { userData, auth } = state;
  const { userBalance, tokenBalance } = userData || {};
  const {
    userData: { publicAddress }
  } = auth || {};
  return {
    publicAddress,
    userBalance,
    tokenBalance,
    currentPortfolioValue: getPortfolioSelector(state)
  };
};

export default connect(
  mapStateToProps,
  { getUserBalanceAction, getTokenBalance }
)(InvestorDashboard);
