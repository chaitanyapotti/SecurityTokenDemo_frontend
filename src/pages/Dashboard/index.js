import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import InvestorDashboard from "../../containers/InvestorDashboard";
import MarketMakerDashboard from "../../containers/MarketMakerDashboard";
import BrokerDealerDashboard from "../../containers/BrokerDealerDashboard";

class Dashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props || {};
    if (!isAuthenticated) {
      history.push("/");
    }
  }

  render() {
    if (localStorage.role === "INVESTOR") {
      return <InvestorDashboard />;
    }
    if (localStorage.role === "MARKET_MAKER") {
      return <MarketMakerDashboard />;
    }
    if (localStorage.role === "BROKER_DEALER") {
      return <BrokerDealerDashboard />;
    }
    return <Button onClick={this.onLogoutClick}>Logout</Button>;
  }
}

Dashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.auth || {};
  return {
    isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction }
)(Dashboard);
