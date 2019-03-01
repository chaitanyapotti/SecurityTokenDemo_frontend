import axios from "axios";
import actionTypes from "../actionTypes";
import config from "../config";

export const amlData = investorData => dispatch => {
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

export const amlComplyCheck = amlData => dispatch => {
  const { firstName, lastName, dob } = amlData || {};
  const d = new Date(dob);
  const birthYear = d.getFullYear();
  axios
    .post(`${"https://cors-anywhere.herokuapp.com/"}https://api.complyadvantage.com/searches?api_key=PQW5kTJwTjk0p2v1n68goJL7CozIBche`, {
      search_term: {
        first_name: firstName,
        last_name: lastName
      },
      client_ref: "CUST092092",
      fuzziness: 0.3,
      filters: {
        types: ["sanction", "warning"],
        birth_year: birthYear
      }
    })
    .then(res => {
      const { content } = res.data;
      const { data } = content || {};
      dispatch({
        type: actionTypes.AML_CHECK_SUCCESS,
        payload: data
      });
    })
    .catch(err => console.log("error in aml ComplyCheck", err));
};
