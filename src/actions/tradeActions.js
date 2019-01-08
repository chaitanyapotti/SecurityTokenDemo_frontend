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

export const isSellButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.SELL_BUTTON_SPINNING
});

export const sellSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.SELL_SUCCESS
});

export const sellTokenAction = (token, tokenAmount, userLocalPublicAddress, sellRate) => dispatch => {
  dispatch(isSellButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=KyberNetworkProxy`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.KyberNetworkProxy, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .swapTokenToEther(config.tokens[token].address, web3.utils.toWei(tokenAmount), sellRate)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isSellButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.SELL_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(sellSuccess(true));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.SELL_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(sellSuccess(false));
                  dispatch(isSellButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.SELL_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(sellSuccess(false));
                  dispatch(isSellButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.SELL_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isSellButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isSellButtonSpinning(false));
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

export const isTransferFromButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_FROM_BUTTON_SPINNING
});

export const transferFromSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_FROM_SUCCESS
});

export const transferTokensFromUser = (token, quantity, userLocalPublicAddress, fromAddress) => dispatch => {
  dispatch(isTransferFromButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=OmiseGo`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.tokens[token].address, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const tokenQuantity = web3.utils.toWei(quantity);
        instance.methods
          .transferFrom(fromAddress, userLocalPublicAddress, tokenQuantity)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isTransferFromButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.TRANSFER_FROM_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(transferFromSuccess(true));
                  dispatch(approveSuccess(false));
                  dispatch(getTokenBalance(fromAddress));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_FROM_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(transferFromSuccess(false));
                  dispatch(isTransferFromButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_FROM_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(transferFromSuccess(false));
                  dispatch(isTransferFromButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_FROM_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isTransferFromButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isTransferFromButtonSpinning(false));
    });
};

export const isApproveButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.APPROVE_BUTTON_SPINNING
});

export const approveSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.APPROVE_SUCCESS
});

export const approveTokenTransfer = (token, quantity, userLocalPublicAddress) => dispatch => {
  dispatch(isApproveButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=OmiseGo`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.tokens[token].address, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const tokenQuantity = web3.utils.toWei(quantity);
        instance.methods
          .approve(config.KyberNetworkProxy, tokenQuantity)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isApproveButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.APPROVE_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(approveSuccess(true));
                  dispatch(sellSuccess(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.APPROVE_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(approveSuccess(false));
                  dispatch(isApproveButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.APPROVE_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(approveSuccess(false));
                  dispatch(isApproveButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.APPROVE_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isApproveButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isApproveButtonSpinning(false));
    });
};
