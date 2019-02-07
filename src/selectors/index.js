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

export const getTokenPortfolioSelector = createSelector(
  getTokenBalance,
  getPriceHistory,
  (tokenBalance, priceHistory) => {
    const portfolio = {};
    for (const item in config.tokens) {
      // item is token
      if (Object.prototype.hasOwnProperty.call(config.tokens, item)) {
        portfolio[item] = {};
        portfolio[item].tokenCount = 0;
        portfolio[item].totalInvested = 0;
        portfolio[item].currentNetPrice = 0;
        portfolio[item].change = 0;
        portfolio[item].changeValue = 0;
        portfolio[item].commission = 0;
        for (const key in tokenBalance) {
          // key is user
          if (Object.prototype.hasOwnProperty.call(tokenBalance, key) && Object.prototype.hasOwnProperty.call(priceHistory, item)) {
            const element = tokenBalance[key];
            if (
              Object.prototype.hasOwnProperty.call(element, item) &&
              Object.prototype.hasOwnProperty.call(element[item], "balance") &&
              Object.prototype.hasOwnProperty.call(element[item], "dollarValue")
            ) {
              portfolio[item].tokenCount += element[item].balance;
              portfolio[item].totalInvested += element[item].dollarValue;
              portfolio[item].currentNetPrice += element[item].balance * priceHistory[item].currentprice * config.etherPrice;
            }
          }
        }
      }
    }
    for (const key in portfolio) {
      if (Object.prototype.hasOwnProperty.call(portfolio, key)) {
        const element = portfolio[key];
        element.changePercent = ((element.currentNetPrice - element.totalInvested) * 100) / element.totalInvested;
        element.changeValue = element.currentNetPrice - element.totalInvested;
        element.commission = 0.1 * element.totalInvested;
      }
    }
    return portfolio;
  }
);
