import actionTypes from "../actionTypes";
import { formatRateToPrice, formatFromWei } from "../helpers/numberHelpers";
import config from "../config";

const INITIAL_STATE = {
  buyTradeData: {},
  sellTradeData: {},
  buyButtonSpinning: false,
  transferButtonSpinning: false,
  buyButtonTransactionHash: "",
  transferButtonTransactionHash: "",
  buySuccess: false,
  transferSuccess: true
};

export default function(state = INITIAL_STATE, action) {
  const currentBuyTradeData = JSON.parse(JSON.stringify(state.buyTradeData));
  const currentSellTradeData = JSON.parse(JSON.stringify(state.sellTradeData));
  switch (action.type) {
    case actionTypes.BUY_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        buySuccess: receipt
      };
    }
    case actionTypes.TRANSFER_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        transferSuccess: receipt
      };
    }
    case actionTypes.BUY_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        buyButtonSpinning: receipt
      };
    }
    case actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        buyButtonTransactionHash: transactionHash
      };
    }
    case actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        transferButtonTransactionHash: transactionHash
      };
    }
    case actionTypes.TRANSFER_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        transferButtonSpinning: receipt
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
      const price = formatRateToPrice(formatFromWei(rate, 18));
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
