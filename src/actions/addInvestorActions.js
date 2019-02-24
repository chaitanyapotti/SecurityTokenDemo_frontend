import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const addInvestor = investorData => dispatch => {
  axios
    .post(`${config.api}/api/add/addinvestor`, investorData)
    .then(res => {
      const { token } = res.data;
      dispatch({
        type: actionTypes.ADD_INVESTOR_SUCCESS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.ADD_INVESTOR_ERROR,
        payload: err.response.data
      })
    );
};
