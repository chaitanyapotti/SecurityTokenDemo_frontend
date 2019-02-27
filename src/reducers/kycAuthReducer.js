import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  id: "",
  tokenError: "",
  sdkToken: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.KYC_AUTH_TOKEN_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        id
      };
    }

    case actionTypes.KYC_AUTH_TOKEN_ERROR:
      return {
        ...state,
        tokenError: action.payload
      };

    case actionTypes.KYC_SDK_TOKEN_SUCCESS: {
      const { token } = action.payload;
      return {
        ...state,
        sdkToken: token
      };
    }

    default:
      return state;
  }
}
