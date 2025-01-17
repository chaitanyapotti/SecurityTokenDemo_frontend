import axios from "axios";
import jwt_decode from "jwt-decode";
import actionTypes from "../actionTypes";
import setAuthToken from "../utils/setAuthToken";
import config from "../config";
import constants from "../helpers/constants";

export const loginUserAction = (userData, history) => dispatch => {
  axios
    .post(`${config.api}/api/users/login`, userData)
    .then(res => {
      const { token, status } = res.data;
      const stringified = JSON.stringify(res.data);
      localStorage.setItem("user_data", stringified);
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      dispatch(setUserData(stringified));
      if (status !== constants.APPROVED) {
        history.push("/profile");
      } else history.push("/dashboard");
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: decoded
});

export const setUserData = userData => ({
  type: actionTypes.SET_USER_DATA,
  payload: userData
});

export const logoutUserAction = history => dispatch => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user_data");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch(setUserData(""));
  dispatch({
    type: actionTypes.SET_USERNAME_OR_EMAIL,
    payload: ""
  });
  dispatch({
    type: actionTypes.SET_PASSWORD,
    payload: ""
  });
  dispatch({
    type: actionTypes.CLEAR_STORE,
    payload: ""
  });
  history.push("/");
};

export const setUsernameOrEmailAction = input => dispatch => {
  dispatch({
    type: actionTypes.SET_USERNAME_OR_EMAIL,
    payload: input
  });
};

export const setPasswordAction = input => dispatch => {
  dispatch({
    type: actionTypes.SET_PASSWORD,
    payload: input
  });
};
