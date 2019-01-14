import actionTypes from "../actionTypes";
import { formatFromWei } from "../helpers/numberHelpers";
import config from "../config";

const INITIAL_STATE = {
  userBalance: {},
  tokenBalance: {},
  portfolioValue: {}
};

export default function(state = INITIAL_STATE, action) {
  const currentTokenBalances = JSON.parse(JSON.stringify(state.tokenBalance));
  const currentUserBalances = JSON.parse(JSON.stringify(state.userBalance));
  const currentPortfolioValues = JSON.parse(JSON.stringify(state.portfolioValue));

  switch (action.type) {
    case actionTypes.CLEAR_STORE: {
      return {
        ...state,
        ...INITIAL_STATE
      };
    }
    case actionTypes.GET_USER_BALANCE: {
      const { user, data } = action.payload || {};
      currentUserBalances[user] = formatFromWei(data, 5);
      return {
        ...state,
        userBalance: currentUserBalances
      };
    }
    case actionTypes.GET_TOKEN_BALANCE: {
      const { token, data, user } = action.payload || {};
      const balance = formatFromWei(data, 3);
      const dollarValue = parseFloat(balance) * config.tokens[token].price;
      currentTokenBalances[user] = currentTokenBalances[user] ? currentTokenBalances[user] : {};
      currentTokenBalances[user][token] = { balance, dollarValue };
      for (const key in currentTokenBalances) {
        if (Object.prototype.hasOwnProperty.call(currentTokenBalances, key)) {
          for (const item in currentTokenBalances[key]) {
            if (Object.prototype.hasOwnProperty.call(currentTokenBalances[key], item)) {
              currentPortfolioValues[key] += currentTokenBalances[key][item].dollarValue;
            }
          }
        }
      }
      return {
        ...state,
        tokenBalance: currentTokenBalances,
        portfolioValue: currentPortfolioValues
      };
    }
    default:
      return state;
  }
}
