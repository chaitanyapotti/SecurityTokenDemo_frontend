import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const signUp = registerData => dispatch => {
  axios
    .post(`${config.api}/api/users/register`, registerData)
    .then(res => {
      const { token } = res.data;
      dispatch({
        type: actionTypes.SIGN_UP_SUCCESS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.SIGN_UP_ERROR,
        payload: err.response.data
      })
    );
};
