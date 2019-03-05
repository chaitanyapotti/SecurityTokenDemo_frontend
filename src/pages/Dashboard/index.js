import React, { Component, lazy } from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { getPriceHistory } from "../../actions/priceHistoryActions";
import ErrorBoundary from "../ErrorBoundary";

const InvestorDashboard = lazy(() => import("../../containers/InvestorDashboard"));
const MarketMakerDashboard = lazy(() => import("../../containers/MarketMakerDashboard"));
const BrokerDealerDashboard = lazy(() => import("../../containers/BrokerDealerDashboard"));

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
    const { history, role } = this.props || {};
    if (role === "INVESTOR") {
      return (
        <ErrorBoundary>
          <InvestorDashboard history={history} />
        </ErrorBoundary>
      );
    }
    if (role === "MARKET_MAKER") {
      return (
        <ErrorBoundary>
          <MarketMakerDashboard history={history} />
        </ErrorBoundary>
      );
    }
    if (role === "BROKER_DEALER") {
      return (
        <ErrorBoundary>
          <BrokerDealerDashboard history={history} />
        </ErrorBoundary>
      );
    }
    return (
      <ErrorBoundary>
        <Button onClick={this.onLogoutClick}>Logout</Button>
      </ErrorBoundary>
    );
  }
}

Dashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  getPriceHistory: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const {
    isAuthenticated,
    userData: { role }
  } = state.auth || {};
  return {
    isAuthenticated,
    role
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, getPriceHistory }
)(Dashboard);
