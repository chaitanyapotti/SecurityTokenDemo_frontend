import actionTypes from "../actionTypes";
import { formatRateToPrice } from "../helpers/numberHelpers";
import config from "../config";

const INITIAL_STATE = {
  buyTradeData: {},
  sellTradeData: {}
};

export default function(state = INITIAL_STATE, action) {
  const currentTradeData = JSON.parse(JSON.stringify(state.tradeData));
  switch (action.type) {
    case actionTypes.FETCHED_BUY_RATE: {
      const { token, data } = action.payload || {};
      const rate = data.expectedRate;
      const price = formatRateToPrice(rate);
      currentTradeData[token] = { rate, price };
      return {
        ...state,
        buyTradeData: currentTradeData
      };
    }
    case actionTypes.FETCHED_SELL_RATE: {
      const { token, data } = action.payload || {};
      const rate = data.expectedRate;
      const price = formatRateToPrice(rate);
      currentTradeData[token] = { rate, price };
      return {
        ...state,
        sellTradeData: currentTradeData
      };
    }
    default:
      return state;
  }
}
