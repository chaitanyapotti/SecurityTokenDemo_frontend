import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import marketMakerReducer from "./marketMakerReducer";
import signinManagerReducer from "./signinManagerReducer";
import tradeReducer from "./tradeReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userData: userReducer,
  marketMakerData: marketMakerReducer,
  signinManagerData: signinManagerReducer,
  tradeData: tradeReducer
});
