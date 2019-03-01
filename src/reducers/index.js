import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import marketMakerReducer from "./marketMakerReducer";
import signinManagerReducer from "./signinManagerReducer";
import tradeReducer from "./tradeReducer";
import priceHistoryReducer from "./priceHistoryReducer";
import kycAuthReducer from "./kycAuthReducer";
import amlReducer from "./amlReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userData: userReducer,
  marketMakerData: marketMakerReducer,
  signinManagerData: signinManagerReducer,
  tradeData: tradeReducer,
  priceHistoryData: priceHistoryReducer,
  form: formReducer,
  kycAuth: kycAuthReducer,
  amlCheck: amlReducer
});
