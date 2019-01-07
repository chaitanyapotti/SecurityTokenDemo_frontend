import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  userBalance: "",
  tokenBalance: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.GET_USER_BALANCE:
      return {
        ...state,
        userBalance: action.payload
      };
    case actionTypes.GET_TOKEN_BALANCE: {
      return {
        ...state,
        tokenBalance: action.payload
      };
    }
    default:
      return state;
  }
}
