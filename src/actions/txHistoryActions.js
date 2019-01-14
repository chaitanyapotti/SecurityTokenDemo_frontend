import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const getTxHistory = (bdAddress, reserveAddress) => dispatch => {
  axios
    .get(`${config.api}/web3/txhistory?reserveaddress=${reserveAddress}&network=${config.network}&useraddress=${bdAddress}`)
    .then(res => {
      if (res.status === 200) {
        const { data } = res.data;
        dispatch({
          type: actionTypes.FETCHED_TX_HISTORY,
          payload: { data }
        });
      }
    })
    .catch(err => console.log(err));
};
