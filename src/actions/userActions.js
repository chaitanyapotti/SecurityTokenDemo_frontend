import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const getUserBalanceAction = publicAddress => async dispatch => {
  axios
    .get(`${config.api}/web3/erc20token/userbalance?address=${publicAddress}&network=${config.network}`)
    .then(res => {
      if (res.status === 200) {
        const { data } = res.data;
        dispatch({
          type: actionTypes.GET_USER_BALANCE,
          payload: data
        });
      }
    })
    .catch(err => console.log(err));
};

export const getTokenBalance = publicAddress => dispatch => {
  for (const token in config.tokens) {
    if (Object.prototype.hasOwnProperty.call(config.tokens, token)) {
      axios
        .get(
          `${config.api}/web3/erc20token/tokenbalance?address=${config.tokens[token].address}&network=${config.network}&useraddress=${publicAddress}`
        )
        .then(res => {
          if (res.status === 200) {
            const { data } = res.data;
            dispatch({
              type: actionTypes.GET_TOKEN_BALANCE,
              payload: { token, data }
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
};
