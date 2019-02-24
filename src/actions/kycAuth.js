import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const kycAuth = () => dispatch => {
  axios
    .post(`${config.api}/api/users/login`, userData)
    .then(res => {
      const { token } = res.data;
      dispatch({
        type: actionTypes.KYC_AUTH_TOKEN_SUCCESS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.KYC_AUTH_TOKEN_ERROR,
        payload: err.response.data
      })
    );
};
