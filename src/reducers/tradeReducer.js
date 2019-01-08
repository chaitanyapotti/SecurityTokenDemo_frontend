import actionTypes from "../actionTypes";
import { formatRateToPrice, formatFromWei } from "../helpers/numberHelpers";
import config from "../config";

const INITIAL_STATE = {
  buyTradeData: {},
  sellTradeData: {},
  buyButtonSpinning: false
};

export default function(state = INITIAL_STATE, action) {
  const currentBuyTradeData = JSON.parse(JSON.stringify(state.buyTradeData));
  const currentSellTradeData = JSON.parse(JSON.stringify(state.sellTradeData));
  switch (action.type) {
    case actionTypes.BUY_BUTTON_SPINNING: {
      return {
        ...state,
        buyButtonSpinning: action.payload
      };
    }
    case actionTypes.FETCHED_BUY_RATE: {
      const { token, data } = action.payload || {};
      const rate = data.expectedRate;
      const price = formatRateToPrice(formatFromWei(rate, 18));
      currentBuyTradeData[token] = { rate, price };
      return {
        ...state,
        buyTradeData: currentBuyTradeData
      };
    }
    case actionTypes.FETCHED_SELL_RATE: {
      const { token, data } = action.payload || {};
      const rate = data.expectedRate;
      const price = formatRateToPrice(rate);
      currentSellTradeData[token] = { rate, price };
      return {
        ...state,
        sellTradeData: currentSellTradeData
      };
    }
    default:
      return state;
  }
}
