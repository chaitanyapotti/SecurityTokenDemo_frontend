import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  addInvestorSuccess: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ADD_INVESTOR_SUCCESS: {
      return {
        ...state,
        addInvestorSuccess: action.payload
      };
    }

    default:
      return state;
  }
}
