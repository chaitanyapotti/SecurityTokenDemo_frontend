import axios from "axios";
import actionTypes from "../actionTypes";

export const kycAuth = () => dispatch => {
  const config = {
    headers: {
      common: {
        Authorization: "Token token=test_ZaRgJLgxxomSw7FPT8x7DcrAABb14dKl",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      }
    }
  };
  axios
    .post(`${"https://cors-anywhere.herokuapp.com/"}https://api.onfido.com/v2/applicants`, { first_name: "Aayush", last_name: "Gupta" }, config)
    .then(res => {
      dispatch({
        type: actionTypes.KYC_AUTH_TOKEN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.KYC_AUTH_TOKEN_ERROR,
        payload: err.response.data
      })
    );
};

export const kycSdkToken = id => dispatch => {
  const config = {
    headers: {
      common: {
        Authorization: "Token token=test_ZaRgJLgxxomSw7FPT8x7DcrAABb14dKl",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      }
    }
  };
  axios
    .post(`${"https://cors-anywhere.herokuapp.com/"}https://api.onfido.com/v2/sdk_token`, { applicant_id: id, referrer: "*://*/*" }, config)
    .then(res => {
      dispatch({
        type: actionTypes.KYC_SDK_TOKEN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => console.log("error in kycSdkToken", err));
};
