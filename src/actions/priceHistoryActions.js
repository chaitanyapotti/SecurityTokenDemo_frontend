import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const getPriceHistory = () => dispatch => {
  for (const token in config.tokens) {
    if (Object.prototype.hasOwnProperty.call(config.tokens, token)) {
      axios
        .get(`${config.api}/api/price?tokenaddress=${config.tokens[token].address}`)
        .then(res => {
          if (res.status === 200) {
            const { data } = res;
            dispatch({
              type: actionTypes.PRICE_HISTORY_SUCCESS,
              payload: { token, data }
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
};
