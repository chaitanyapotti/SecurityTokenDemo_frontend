import actionTypes from "../actionTypes";
import isEmpty from "../validation/is-Empty";

const INITIAL_STATE = {
  isAuthenticated: false,
  user: {},
  usernameOrEmail: "",
  password: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case actionTypes.SET_USERNAME_OR_EMAIL:
      return {
        ...state,
        usernameOrEmail: action.payload
      };
    case actionTypes.SET_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    default:
      return state;
  }
}
