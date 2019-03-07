import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const addInvestor = investorData => dispatch => {
  axios
    .post(`${config.api}/api/add/addinvestor`, investorData)
    .then(res => {
      if (res.status === 200)
        dispatch({
          type: actionTypes.ADD_INVESTOR_SUCCESS,
          payload: true
        });
      else
        dispatch({
          type: actionTypes.ADD_INVESTOR_SUCCESS,
          payload: false
        });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.ADD_INVESTOR_SUCCESS,
        payload: false
      })
    );
};
