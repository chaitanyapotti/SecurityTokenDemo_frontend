import axios from "axios";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, SET_USERNAME_OR_EMAIL, SET_PASSWORD } from "./types";
import setAuthToken from "../utils/setAuthToken";

export const loginUserAction = (userData, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token, role, first_name } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("firstName", first_name);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
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
  dispatch({
    type: SET_USERNAME_OR_EMAIL,
    payload: ""
  });
  dispatch({
    type: SET_PASSWORD,
    payload: ""
  });
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
