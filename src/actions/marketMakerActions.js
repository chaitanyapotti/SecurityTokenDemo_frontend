import axios from "axios";
import { ON_DROPDOWN_CHANGE } from "./types";
import web3 from "../helpers/web3";
import config from "../config";

export const onDropdownChange = value => dispatch => {
  dispatch({
    type: ON_DROPDOWN_CHANGE,
    payload: value
  });
};
