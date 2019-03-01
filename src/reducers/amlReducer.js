import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  matchStatus: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.AML_CHECK_SUCCESS: {
      const { match_status } = action.payload;
      return {
        ...state,
        matchStatus: match_status
      };
    }

    default:
      return state;
  }
}
