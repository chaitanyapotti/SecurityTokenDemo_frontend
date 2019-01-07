import actionTypes from "../actionTypes";

export const initialState = {
  userLocalPublicAddress: "",
  userPreviousLocalPublicAddress: null,
  signinStatusFlag: 0,
  metamaskPreviousInstallationState: null,
  metamaskPreviousNetworkName: "",
  isMetamaskNetworkChecked: false,
  isMetamaskInstallationChecked: false,
  isUserDefaultAccountChecked: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.METAMASK_LOGGED_IN: {
      return {
        ...state,
        signinStatusFlag: action.payload
      };
    }
    case actionTypes.METAMASK_NETWORK: {
      return {
        ...state,
        networkName: action.payload,
        metamaskPreviousNetworkName: action.payload,
        isMetamaskNetworkChecked: true
      };
    }
    case actionTypes.METAMASK_INSTALLATION_STATUS_CHECK: {
      if (action.payload) {
        return {
          ...state,
          metamaskPreviousInstallationState: action.payload,
          isMetamaskInstallationChecked: true
        };
      }
      return {
        ...state,
        signinStatusFlag: 0,
        metamaskPreviousInstallationState: action.payload,
        isMetamaskInstallationChecked: true,
        isMetamaskNetworkChecked: true,
        isUserDefaultAccountChecked: true
      };
    }
    case actionTypes.USER_DEFAULT_ACCOUNT_CHANGED: {
      if (action.payload !== "") {
        return {
          ...state,
          userLocalPublicAddress: action.payload,
          userPreviousLocalPublicAddress: action.payload,
          isUserDefaultAccountChecked: true
        };
      }
      return {
        ...state,
        userLocalPublicAddress: "",
        userPreviousLocalPublicAddress: "",
        signinStatusFlag: 1,
        isUserDefaultAccountChecked: true,
        isMetamaskNetworkChecked: true
      };
    }
    default:
      return state;
  }
};
