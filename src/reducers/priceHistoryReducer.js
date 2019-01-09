import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  priceHistory: {}
};

export default function(state = INITIAL_STATE, action) {
  const currentPriceHistory = JSON.parse(JSON.stringify(state.priceHistory));
  switch (action.type) {
    case actionTypes.PRICE_HISTORY_SUCCESS: {
      const { token, data } = action.payload || {};
      currentPriceHistory[token] = data;
      return {
        ...state,
        priceHistory: currentPriceHistory
      };
    }
    default:
      return state;
  }
}
