import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  dropDownSelect: "",
  transferTokenButtonSpinning: false,
  transferTokenButtonTransactionHash: "",
  transferTokenSuccess: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.CLEAR_STORE: {
      return {
        ...state,
        ...INITIAL_STATE
      };
    }
    case actionTypes.TRANSFER_TOKEN_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        transferTokenButtonSpinning: receipt
      };
    }
    case actionTypes.TRANSFER_TOKEN_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        transferTokenSuccess: receipt
      };
    }
    case actionTypes.TRANSFER_TOKEN_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        transferTokenButtonTransactionHash: transactionHash
      };
    }
    case actionTypes.ON_DROPDOWN_CHANGE:
      return {
        ...state,
        dropDownSelect: action.payload
      };
    default:
      return state;
  }
}
