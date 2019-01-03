import { SET_CURRENT_USER, SET_USERNAME_OR_EMAIL, SET_PASSWORD } from "../actions/types";
import isEmpty from "../validation/is-Empty";

const INITIAL_STATE = {
  isAuthenticated: false,
  user: {},
  usernameOrEmail: "",
  password: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_USERNAME_OR_EMAIL:
      return {
        ...state,
        usernameOrEmail: action.payload
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    default:
      return state;
  }
}
