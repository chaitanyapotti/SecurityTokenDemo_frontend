import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  dropDownSelect: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ON_DROPDOWN_CHANGE:
      return {
        ...state,
        dropDownSelect: action.payload
      };
    default:
      return state;
  }
}
