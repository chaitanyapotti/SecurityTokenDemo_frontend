import React, { Component, Suspense } from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { getPriceHistory } from "../../actions/priceHistoryActions";

const InvestorDashboard = React.lazy(() => import("../../containers/InvestorDashboard"));
const MarketMakerDashboard = React.lazy(() => import("../../containers/MarketMakerDashboard"));
const BrokerDealerDashboard = React.lazy(() => import("../../containers/BrokerDealerDashboard"));

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
      return (
        <Suspense fallback={<div />}>
          <InvestorDashboard history={history} />
        </Suspense>
      );
    }
    if (role === "MARKET_MAKER") {
      return (
        <Suspense fallback={<div />}>
          <MarketMakerDashboard history={history} />
        </Suspense>
      );
    }
    if (role === "BROKER_DEALER") {
      return (
        <Suspense fallback={<div />}>
          <BrokerDealerDashboard history={history} />
        </Suspense>
      );
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
