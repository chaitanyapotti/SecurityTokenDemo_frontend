import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const signUp = (values, token) => dispatch => {
  console.log("ere", values, token);
  const authorization = `Bearer ${token}`;
  axios
    .post(
      `${config.api}/api/users/register`,
      {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
        publicAddress: values.pubadd,
        phone: values.contact
      },
      {
        headers: {
          Authorization: authorization
        }
      }
    )
    .then(res => {
      console.log(res);
      dispatch({
        type: actionTypes.SIGN_UP_SUCCESS,
        payload: {}
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: actionTypes.SIGN_UP_ERROR,
        payload: err.response.data
      });
    });
};
