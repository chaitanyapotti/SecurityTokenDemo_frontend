import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import marketMakerReducer from "./marketMakerReducer";
import signinManagerReducer from "./signinManagerReducer";
import tradeReducer from "./tradeReducer";
import priceHistoryReducer from "./priceHistoryReducer";
import amlReducer from "./amlReducer";
import investorReducer from "./investorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userData: userReducer,
  marketMakerData: marketMakerReducer,
  signinManagerData: signinManagerReducer,
  tradeData: tradeReducer,
  priceHistoryData: priceHistoryReducer,
  form: formReducer,
  amlCheck: amlReducer,
  investorData: investorReducer
});
