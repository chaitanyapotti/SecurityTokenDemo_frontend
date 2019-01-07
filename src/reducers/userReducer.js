import { GET_USER_BALANCE, GET_TOKEN_BALANCE } from "../actions/types";

const INITIAL_STATE = {
  userBalance: "",
  tokenBalance: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USER_BALANCE:
      return {
        ...state,
        userBalance: action.payload
      };
    case GET_TOKEN_BALANCE: {
      return {
        ...state,
        tokenBalance: action.payload
      };
    }
    default:
      return state;
  }
}
