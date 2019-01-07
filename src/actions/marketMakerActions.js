import axios from "axios";
import actionTypes from "../actionTypes";
import web3 from "../helpers/web3";
import config from "../config";

export const onDropdownChange = value => dispatch => {
  dispatch({
    type: actionTypes.ON_DROPDOWN_CHANGE,
    payload: value
  });
};
