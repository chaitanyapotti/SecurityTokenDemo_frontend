import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Proptypes from "prop-types";
import { fetchCurrentAccount } from "../../actions/signinManagerActions";

class SigninManager extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  initAddressPoll() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        const { fetchCurrentAccount: getCurrentAccount } = this.props;
        const { userPreviousLocalPublicAddress, metamaskPreviousNetworkName, metamaskPreviousInstallationState, isMetamaskInstallationChecked } =
          this.props || {};
        getCurrentAccount(
          userPreviousLocalPublicAddress,
          metamaskPreviousNetworkName,
          metamaskPreviousInstallationState,
          isMetamaskInstallationChecked
        );
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initAddressPoll();
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => {
  const {
    userLocalPublicAddress,
    userPreviousLocalPublicAddress,
    metamaskPreviousNetworkName,
    metamaskPreviousInstallationState,
    isMetamaskInstallationChecked
  } = state.signinManagerData || {};
  return {
    userLocalPublicAddress,
    userPreviousLocalPublicAddress,
    metamaskPreviousNetworkName,
    metamaskPreviousInstallationState,
    isMetamaskInstallationChecked
  };
};

SigninManager.propTypes = {
  fetchCurrentAccount: Proptypes.func.isRequired
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCurrentAccount
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninManager);
