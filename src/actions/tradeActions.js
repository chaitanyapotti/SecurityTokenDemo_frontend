import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import config from "../config";
import { pollTxHash } from "./helperActions";

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

export const isBuyButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.BUY_BUTTON_SPINNING
});

export const buySuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.BUY_SUCCESS
});

export const buyTokenAction = (token, etherAmount, userLocalPublicAddress, buyRate) => dispatch => {
  dispatch(isBuyButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=KyberNetworkProxy`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.KyberNetworkProxy, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .swapEtherToToken(config.tokens[token].address, buyRate)
          .send({
            from: userLocalPublicAddress,
            value: web3.utils.toWei(etherAmount, "ether"),
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isBuyButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(buySuccess(true));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.R1_FINALIZE_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(buySuccess(false));
                  dispatch(isBuyButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(buySuccess(false));
                  dispatch(isBuyButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isBuyButtonSpinning(false));
          });
      }
    })
    .catch(err => console.log(err));
};
