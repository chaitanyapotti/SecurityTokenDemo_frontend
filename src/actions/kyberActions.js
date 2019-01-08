import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import config from "../config";

// export const getUserBalanceAction = publicAddress => async dispatch => {
//   const balance = await web3.eth.getBalance(publicAddress);
//   dispatch({
//     type: actionTypes.GET_USER_BALANCE,
//     payload: balance
//   });
// };

// export const getTokenBalance = publicAddress => dispatch => {
//   for (const token in config.tokens) {
//     if (Object.prototype.hasOwnProperty.call(config.tokens, token)) {
//       axios
//         .get(
//           `${config.api}/web3/erc20token/tokenbalance?address=${config.tokens[token].address}&network=${config.network}&useraddress=${publicAddress}`
//         )
//         .then(res => {
//           if (res.status === 200) {
//             const { data } = res.data;
//             dispatch({
//               type: actionTypes.GET_TOKEN_BALANCE,
//               payload: { token, data }
//             });
//           }
//         })
//         .catch(err => console.log(err));
//     }
//   }
// };
