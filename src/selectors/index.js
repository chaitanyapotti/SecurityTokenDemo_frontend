import { createSelector } from "reselect";
import config from "../config";

const getTokenBalanceRIV = state => state.userData.tokenBalance.RIV || {};
const getPriceHistoryRIV = state => state.priceHistoryData.priceHistory.RIV || {};
const getTokenBalanceLMD = state => state.userData.tokenBalance.LMD || {};
const getPriceHistoryLMD = state => state.priceHistoryData.priceHistory.LMD || {};

export const getPortfolioSelector = createSelector(
  getTokenBalanceRIV,
  getPriceHistoryRIV,
  getTokenBalanceLMD,
  getPriceHistoryLMD,
  (tokenBalanceRIV, priceHistoryRIV, tokenBalanceLMD, priceHistoryLMD) =>
    (tokenBalanceRIV.balance * priceHistoryRIV.currentprice + tokenBalanceLMD.balance * priceHistoryLMD.currentprice) * config.etherPrice
);
