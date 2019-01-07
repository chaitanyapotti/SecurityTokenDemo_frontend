import { ON_DROPDOWN_CHANGE } from "../actions/types";

const INITIAL_STATE = {
  dropDownSelect: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ON_DROPDOWN_CHANGE:
      return {
        ...state,
        dropDownSelect: action.payload
      };
    default:
      return state;
  }
}
