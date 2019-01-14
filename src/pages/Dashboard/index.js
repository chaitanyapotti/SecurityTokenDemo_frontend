import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import InvestorDashboard from "../../containers/InvestorDashboard";
import MarketMakerDashboard from "../../containers/MarketMakerDashboard";
import BrokerDealerDashboard from "../../containers/BrokerDealerDashboard";
import { getPriceHistory } from "../../actions/priceHistoryActions";

class Dashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props || {};
    const { getPriceHistory: fetchPriceHistory } = this.props;
    if (!isAuthenticated) {
      history.push("/");
    }
    fetchPriceHistory();
  }

  render() {
    const { history } = this.props || {};
    const { role } = JSON.parse(localStorage.getItem("user_data")) || {};
    if (role === "INVESTOR") {
      return <InvestorDashboard history={history} />;
    }
    if (role === "MARKET_MAKER") {
      return <MarketMakerDashboard history={history} />;
    }
    if (role === "BROKER_DEALER") {
      return <BrokerDealerDashboard history={history} />;
    }
    return <Button onClick={this.onLogoutClick}>Logout</Button>;
  }
}

Dashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  getPriceHistory: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.auth || {};
  return {
    isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getPriceHistory }
)(Dashboard);
