import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import config from "../config";
import { pollTxHash } from "./helperActions";
import { getTokenBalance } from "./userActions";

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

export const buyTokenAction = (token, etherAmount, userLocalPublicAddress, buyRate, toAddress) => dispatch => {
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
                  dispatch(transferSuccess(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED
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
    .catch(err => {
      console.log(err);
      dispatch(isBuyButtonSpinning(false));
    });
};

export const sellTokenAction = (token, tokenAmount, userLocalPublicAddress, sellRate, toAddress) => dispatch => {
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
          .swapTokenToEther(config.tokens[token].address, web3.utils.toWei(tokenAmount, "ether"), sellRate)
          .send({
            from: userLocalPublicAddress,
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
                  dispatch(transferSuccess(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.BUY_BUTTON_TRANSACTION_HASH_RECEIVED
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
    .catch(err => {
      console.log(err);
      dispatch(isBuyButtonSpinning(false));
    });
};

export const isTransferButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_BUTTON_SPINNING
});

export const transferSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_SUCCESS
});

export const transferTokensToUser = (token, quantity, userLocalPublicAddress, toAddress) => dispatch => {
  dispatch(isTransferButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=OmiseGo`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.tokens[token].address, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .transfer(toAddress, quantity)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isTransferButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(transferSuccess(true));
                  dispatch(getTokenBalance(toAddress));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(transferSuccess(false));
                  dispatch(isTransferButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(transferSuccess(false));
                  dispatch(isTransferButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isTransferButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isTransferButtonSpinning(false));
    });
};

export const transferTokensFromUser = (token, quantity, userLocalPublicAddress, fromAddress) => dispatch => {
  dispatch(isTransferButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=OmiseGo`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.tokens[token].address, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .transferFrom(fromAddress, userLocalPublicAddress, quantity)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isTransferButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(transferSuccess(true));
                  dispatch(getTokenBalance(fromAddress));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(transferSuccess(false));
                  dispatch(isTransferButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(transferSuccess(false));
                  dispatch(isTransferButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isTransferButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isTransferButtonSpinning(false));
    });
};
