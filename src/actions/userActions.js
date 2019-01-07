import axios from "axios";
import { GET_USER_BALANCE, GET_TOKEN_BALANCE } from "./types";
import web3 from "../helpers/web3";
import config from "../config";

export function getUserBalanceAction(publicAddress) {
  return async dispatch => {
    const balance = await web3.eth.getBalance(publicAddress);
    dispatch({
      type: GET_USER_BALANCE,
      payload: balance
    });
  };
}

export const getTokenBalance = publicAddress => dispatch => {
  axios
    .get(`web3/erc20token/tokenbalance?address=${config.tokenAddress}&network=${config.network}&useraddress=${publicAddress}`)
    .then(res => {
      const { data } = res.data;
      dispatch({
        type: GET_TOKEN_BALANCE,
        payload: data
      });
    })
    .catch(err => console.log(err));
};
