import actionTypes from "../actionTypes";
import { formatFromWei } from "../helpers/numberHelpers";
import config from "../config";

const INITIAL_STATE = {
  userBalance: "",
  tokenBalance: {},
  portfolioValue: 0
};

export default function(state = INITIAL_STATE, action) {
  const currentTokenBalances = JSON.parse(JSON.stringify(state.tokenBalance));
  switch (action.type) {
    case actionTypes.CLEAR_STORE: {
      return {
        ...state,
        ...INITIAL_STATE
      };
    }
    case actionTypes.GET_USER_BALANCE:
      return {
        ...state,
        userBalance: formatFromWei(action.payload, 5)
      };
    case actionTypes.GET_TOKEN_BALANCE: {
      const { token, data } = action.payload || {};
      const balance = formatFromWei(data, 3);
      const dollarValue = parseFloat(balance) * config.tokens[token].price;
      currentTokenBalances[token] = { balance, dollarValue };
      let portfolioValue = 0;
      for (const key in currentTokenBalances) {
        if (Object.prototype.hasOwnProperty.call(currentTokenBalances, key)) {
          portfolioValue += currentTokenBalances[key].dollarValue;
        }
      }
      return {
        ...state,
        tokenBalance: currentTokenBalances,
        portfolioValue
      };
    }
    default:
      return state;
  }
}
