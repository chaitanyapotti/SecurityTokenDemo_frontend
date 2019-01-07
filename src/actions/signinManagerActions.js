import web3 from "../helpers/web3";
import actionTypes from "../actionTypes";

export const fetchCurrentAccount = (
  userPreviousLocalPublicAddress,
  metamaskPreviousNetworkName,
  metamaskPreviousInstallationState,
  isMetamaskInstallationChecked
) => dispatch => {
  if (web3.currentProvider === null) {
    if (!metamaskPreviousInstallationState && !isMetamaskInstallationChecked) {
      return dispatch({
        type: actionTypes.METAMASK_INSTALLATION_STATUS_CHECK,
        payload: false
      });
    }
    return;
  }
  if (!metamaskPreviousInstallationState && !isMetamaskInstallationChecked) {
    dispatch({
      type: actionTypes.METAMASK_INSTALLATION_STATUS_CHECK,
      payload: true
    });
  }
  web3.eth.net
    .getNetworkType()
    .then(networkName => {
      if (networkName !== metamaskPreviousNetworkName) {
        dispatch({
          type: actionTypes.METAMASK_NETWORK,
          payload: networkName
        });
        if (networkName !== "rinkeby")
          dispatch({
            type: actionTypes.METAMASK_LOGGED_IN,
            payload: 2
          });
      }
    })
    .catch(err => {
      console.log("err: ", err);
    });
  web3.eth
    .getAccounts()
    .then(accounts => {
      if (accounts.length > 0) {
        if (accounts[0] !== userPreviousLocalPublicAddress) {
          dispatch({
            type: actionTypes.USER_DEFAULT_ACCOUNT_CHANGED,
            payload: accounts[0]
          });
          dispatch({
            type: actionTypes.METAMASK_LOGGED_IN,
            payload: 3
          });
        }
      } else if (userPreviousLocalPublicAddress !== "") {
        dispatch({
          type: actionTypes.USER_DEFAULT_ACCOUNT_CHANGED,
          payload: ""
        });

        // dispatch({
        //   type: actionTypes.USER_LOGGED_OUT,
        //   payload: ""
        // });
      }
    })
    .catch(err => {
      console.log("error occured: ", err);
    });
};
