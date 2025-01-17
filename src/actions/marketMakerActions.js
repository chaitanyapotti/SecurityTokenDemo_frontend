import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import { significantDigits } from "../helpers/numberHelpers";
import config from "../config";
import { pollTxHash } from "./helperActions";
import { getTokenBalance, getUserBalanceAction } from "./userActions";

export const onDropdownChange = value => dispatch => {
  dispatch({
    type: actionTypes.ON_DROPDOWN_CHANGE,
    payload: value
  });
};

export const isDepositEtherButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.DEPOSIT_ETHER_BUTTON_SPINNING
});

export const depositEtherSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.DEPOSIT_ETHER_SUCCESS
});

export const depositEther = (amount, reserveAddress, userLocalPublicAddress) => async dispatch => {
  dispatch(isDepositEtherButtonSpinning(true));
  const gasPrice = await web3.eth.getGasPrice();
  web3.eth
    .sendTransaction({
      from: userLocalPublicAddress,
      to: reserveAddress,
      value: web3.utils.toWei(amount, "ether"),
      gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
    })
    .on("transactionHash", transactionHash => {
      dispatch(isDepositEtherButtonSpinning(false));
      dispatch({
        payload: { transactionHash },
        type: actionTypes.DEPOSIT_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
      });
      dispatch(
        pollTxHash(
          transactionHash,
          () => {
            dispatch(depositEtherSuccess(true));
            dispatch(getUserBalanceAction(reserveAddress));
            dispatch({
              payload: { transactionHash: "" },
              type: actionTypes.DEPOSIT_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
          },
          () => {
            dispatch(depositEtherSuccess(false));
            dispatch(isDepositEtherButtonSpinning(false));
            dispatch({
              payload: { transactionHash: "" },
              type: actionTypes.DEPOSIT_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
          },
          () => {},
          () => {
            dispatch(depositEtherSuccess(false));
            dispatch(isDepositEtherButtonSpinning(false));
            dispatch({
              payload: { transactionHash: "" },
              type: actionTypes.DEPOSIT_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
          }
        )
      );
    })
    .catch(err => {
      console.error(err.message);
      dispatch(isDepositEtherButtonSpinning(false));
    });
};

export const isWithdrawEtherButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.WITHDRAW_ETHER_BUTTON_SPINNING
});

export const withdrawEtherSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.WITHDRAW_ETHER_SUCCESS
});

export const withdrawEther = (amount, reserveAddress, userLocalPublicAddress) => async dispatch => {
  dispatch(isWithdrawEtherButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=KyberReserve`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, reserveAddress, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .withdrawEther(web3.utils.toWei(amount), config.withdrawAddress)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isWithdrawEtherButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.WITHDRAW_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(withdrawEtherSuccess(true));
                  dispatch(getUserBalanceAction(reserveAddress));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(withdrawSuccess(false));
                  dispatch(isWithdrawEtherButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(withdrawSuccess(false));
                  dispatch(isWithdrawEtherButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isWithdrawEtherButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isWithdrawEtherButtonSpinning(false));
    });
};

export const isTransferTokenButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_TOKEN_BUTTON_SPINNING
});

export const transferTokenSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.TRANSFER_TOKEN_SUCCESS
});

export const depositToken = (quantity, token, reserveAddress, userLocalPublicAddress, reserveType) => async dispatch => {
  dispatch(isTransferTokenButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=OmiseGo`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.tokens[token].address, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .transfer(reserveAddress, web3.utils.toWei(quantity, "ether"))
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isTransferTokenButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.TRANSFER_TOKEN_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(transferTokenSuccess(true));
                  dispatch(getTokenBalance(reserveAddress, reserveType));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_TOKEN_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(transferTokenSuccess(false));
                  dispatch(isTransferTokenButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_TOKEN_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(transferTokenSuccess(false));
                  dispatch(isTransferTokenButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.TRANSFER_TOKEN_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isTransferTokenButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isTransferTokenButtonSpinning(false));
    });
};

export const isWithdrawButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.WITHDRAW_BUTTON_SPINNING
});

export const withdrawSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.WITHDRAW_SUCCESS
});

// withdraws token
export const withdrawAction = (token, amount, userLocalPublicAddress, reserveAddress, reserveType) => dispatch => {
  dispatch(isWithdrawButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=KyberReserve`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, reserveAddress, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .withdrawToken(config.tokens[token].address, web3.utils.toWei(amount), config.withdrawAddress)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isWithdrawButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.WITHDRAW_BUTTON_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(withdrawSuccess(true));
                  dispatch(getTokenBalance(reserveAddress, reserveType));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(withdrawSuccess(false));
                  dispatch(isWithdrawButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(withdrawSuccess(false));
                  dispatch(isWithdrawButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.WITHDRAW_BUTTON_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isWithdrawButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isWithdrawButtonSpinning(false));
    });
};

export const isSetCompactDataButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.COMPACT_DATA_BUTTON_SPINNING
});

export const compactDataSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.COMPACT_DATA_SUCCESS
});

// order should be knc, riv, lmd - one pt is 0.1% change
// refer https://developer.kyber.network/docs/ReservesGuide/
// userlocalpublicaddress must be operator address
export const setCompactData = (token, baseBuy, baseSell, userLocalPublicAddress) => dispatch => {
  // const compactBuyHex = [bytesToHex([0, ...buyData.map(item => parseFloat(item) * 10)])];
  // const compactSellHex = [bytesToHex([0, ...sellData.map(item => parseFloat(item) * 10)])];
  // console.log([0, ...buyData.map(item => parseFloat(item) * 10)], [0, ...sellData.map(item => parseFloat(item) * 10)], buyData, sellData);
  const compactBuyHex = ["0x0000000000000000000000000000"];
  const compactSellHex = ["0x0000000000000000000000000000"];
  const updatedBaseBuy = [web3.utils.toWei(significantDigits(config.etherPrice / parseFloat(baseBuy)).toString())];
  const updatedBaseSell = [web3.utils.toWei(significantDigits(parseFloat(baseSell) / config.etherPrice).toString())];
  dispatch(isSetCompactDataButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=ConversionRates`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.ConversionRates, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const blockNumber = await web3.eth.getBlockNumber();
        instance.methods
          .setBaseRate([config.tokens[token].address], updatedBaseBuy, updatedBaseSell, compactBuyHex, compactSellHex, blockNumber, [0])
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isSetCompactDataButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.COMPACT_DATA_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(compactDataSuccess(true));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.COMPACT_DATA_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(compactDataSuccess(false));
                  dispatch(isSetCompactDataButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.COMPACT_DATA_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(compactDataSuccess(false));
                  dispatch(isSetCompactDataButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.COMPACT_DATA_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isSetCompactDataButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isSetCompactDataButtonSpinning(false));
    });
};

export const isSetQtyStepButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.QTY_STEP_BUTTON_SPINNING
});

export const qtyStepSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.QTY_STEP_SUCCESS
});

export const setQtyStepFunction = (token, xBuy, yBuy, xSell, ySell, userLocalPublicAddress) => dispatch => {
  const buyx = xBuy.map(item => web3.utils.toWei(item.toString()));
  const sellx = xSell.map(item => web3.utils.toWei(item.toString()));
  dispatch(isSetQtyStepButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=ConversionRates`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.ConversionRates, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .setQtyStepFunction(config.tokens[token].address, buyx, yBuy, sellx, ySell)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isSetQtyStepButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.QTY_STEP__TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(qtyStepSuccess(true));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.QTY_STEP__TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(qtyStepSuccess(false));
                  dispatch(isSetQtyStepButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.QTY_STEP__TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(qtyStepSuccess(false));
                  dispatch(isSetQtyStepButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.QTY_STEP__TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isSetQtyStepButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isSetQtyStepButtonSpinning(false));
    });
};

export const isSetImbalanceStepButtonSpinning = receipt => ({
  payload: { receipt },
  type: actionTypes.IMBALANCE_STEP_BUTTON_SPINNING
});

export const imbalanceStepSuccess = receipt => ({
  payload: { receipt },
  type: actionTypes.IMBALANCE_STEP_SUCCESS
});

export const setImbalanceStepFunction = (token, xBuy, yBuy, xSell, ySell, userLocalPublicAddress) => dispatch => {
  const buyx = xBuy.map(item => web3.utils.toWei(item.toString()));
  const sellx = xSell.map(item => web3.utils.toWei(item.toString()));
  dispatch(isSetImbalanceStepButtonSpinning(true));
  axios
    .get(`${config.api}/api/contractdata?name=ConversionRates`)
    .then(async res => {
      if (res.status === 200) {
        const { data } = res.data;
        const { abi } = data || {};
        const instance = new web3.eth.Contract(abi, config.ConversionRates, { from: userLocalPublicAddress });
        const gasPrice = await web3.eth.getGasPrice();
        instance.methods
          .setImbalanceStepFunction(config.tokens[token].address, buyx, yBuy, sellx, ySell)
          .send({
            from: userLocalPublicAddress,
            gasPrice: (parseFloat(gasPrice) + 2000000000).toString()
          })
          .on("transactionHash", transactionHash => {
            dispatch(isSetImbalanceStepButtonSpinning(false));
            dispatch({
              payload: { transactionHash },
              type: actionTypes.IMBALANCE_STEP_TRANSACTION_HASH_RECEIVED
            });
            dispatch(
              pollTxHash(
                transactionHash,
                () => {
                  dispatch(imbalanceStepSuccess(true));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.IMBALANCE_STEP_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {
                  dispatch(imbalanceStepSuccess(false));
                  dispatch(isSetImbalanceStepButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.IMBALANCE_STEP_TRANSACTION_HASH_RECEIVED
                  });
                },
                () => {},
                () => {
                  dispatch(imbalanceStepSuccess(false));
                  dispatch(isSetImbalanceStepButtonSpinning(false));
                  dispatch({
                    payload: { transactionHash: "" },
                    type: actionTypes.IMBALANCE_STEP_TRANSACTION_HASH_RECEIVED
                  });
                }
              )
            );
          })
          .catch(err => {
            console.error(err.message);
            dispatch(isSetImbalanceStepButtonSpinning(false));
          });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(isSetImbalanceStepButtonSpinning(false));
    });
};
