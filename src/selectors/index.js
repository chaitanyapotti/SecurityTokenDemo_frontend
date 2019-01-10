import { createSelector } from "reselect";
import config from "../config";

const getTokenBalance = state => state.userData.tokenBalance || {};
const getPriceHistory = state => state.priceHistoryData.priceHistory || {};

export const getPortfolioSelector = createSelector(
  getTokenBalance,
  getPriceHistory,
  (tokenBalance, priceHistory) => {
    let portfolio = 0;
    for (const key in config.tokens) {
      if (
        Object.prototype.hasOwnProperty.call(config.tokens, key) &&
        Object.prototype.hasOwnProperty.call(tokenBalance, key) &&
        Object.prototype.hasOwnProperty.call(priceHistory, key)
      ) {
        portfolio += tokenBalance[key].balance * priceHistory[key].currentprice;
      }
    }
    return portfolio * config.etherPrice;
  }
);
