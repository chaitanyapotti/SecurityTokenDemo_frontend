import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import config from "../config";

export const getBuyRate = (token, etherAmount) => dispatch => {
  axios
    .get(`${config.api}/web3/trade/getbuyrate?tokenaddress=${config.tokens[token].address}&network=${config.network}&etheramount=${etherAmount}`)
    .then(res => {
      if (res.status === 200) {
        const { data } = res.data;
        dispatch({
          type: actionTypes.FETCHED_BUY_RATE,
          payload: { token, data }
        });
      }
    })
    .catch(err => console.log(err));
};

export const getSellRate = (token, tokenAmount) => dispatch => {
  axios
    .get(`${config.api}/web3/trade/getsellrate?tokenaddress=${config.tokens[token].address}&network=${config.network}&tokenamount=${tokenAmount}`)
    .then(res => {
      if (res.status === 200) {
        const { data } = res.data;
        dispatch({
          type: actionTypes.FETCHED_SELL_RATE,
          payload: { token, data }
        });
      }
    })
    .catch(err => console.log(err));
};
