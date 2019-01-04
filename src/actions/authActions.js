import axios from "axios";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, SET_USERNAME_OR_EMAIL, SET_PASSWORD } from "./types";
import setAuthToken from "../utils/setAuthToken";

export const loginUserAction = (userData, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

export const logoutUserAction = history => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  history.push("/");
};

export const setUsernameOrEmailAction = input => dispatch => {
  dispatch({
    type: SET_USERNAME_OR_EMAIL,
    payload: input
  });
};

export const setPasswordAction = input => dispatch => {
  dispatch({
    type: SET_PASSWORD,
    payload: input
  });
};
