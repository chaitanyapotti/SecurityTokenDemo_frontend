import { createSelector } from "reselect";
import config from "../config";

const getTokenBalance = state => state.userData.tokenBalance || {};
const getPriceHistory = state => state.priceHistoryData.priceHistory || {};

export const getPortfolioSelector = createSelector(
  getTokenBalance,
  getPriceHistory,
  (tokenBalance, priceHistory) => {
    const portfolio = {};
    for (const key in tokenBalance) {
      // per user
      if (Object.prototype.hasOwnProperty.call(tokenBalance, key)) {
        const element = tokenBalance[key];
        portfolio[key] = {};
        portfolio[key].total = 0;
        for (const item in config.tokens) {
          // per token
          if (
            Object.prototype.hasOwnProperty.call(config.tokens, item) &&
            Object.prototype.hasOwnProperty.call(element, item) &&
            Object.prototype.hasOwnProperty.call(priceHistory, item)
          ) {
            portfolio[key][item] = element[item].balance * priceHistory[item].currentprice * config.etherPrice;
            portfolio[key].total += element[item].balance * priceHistory[item].currentprice * config.etherPrice;
          }
        }
      }
    }

    return portfolio;
  }
);
