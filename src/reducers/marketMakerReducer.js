import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  dropDownSelect: "",
  transferTokenButtonSpinning: false,
  transferTokenButtonTransactionHash: "",
  transferTokenSuccess: false,
  withdrawTokenButtonSpinning: false,
  withdrawTokenButtonTransactionHash: "",
  withdrawTokenSuccess: false,
  depositEtherButtonSpinning: false,
  depositEtherButtonTransactionHash: "",
  depositEtherSuccess: false,
  modifyRatesButtonSpinning: false,
  modifyRatesTransactionHash: "",
  tradeButtonSpinning: false,
  tradeButtonTransactionHash: "",
  modifyRatesSuccess: false,
  tradeSuccess: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.CLEAR_STORE: {
      return {
        ...state,
        ...INITIAL_STATE
      };
    }
    case actionTypes.COMPACT_DATA_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        modifyRatesButtonSpinning: receipt
      };
    }
    case actionTypes.QTY_STEP_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        tradeButtonSpinning: receipt
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
    case actionTypes.COMPACT_DATA_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        modifyRatesTransactionHash: transactionHash
      };
    }
    case actionTypes.QTY_STEP__TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        tradeButtonTransactionHash: transactionHash
      };
    }
    case actionTypes.WITHDRAW_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        withdrawTokenButtonSpinning: receipt
      };
    }
    case actionTypes.WITHDRAW_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        withdrawTokenSuccess: receipt
      };
    }
    case actionTypes.COMPACT_DATA_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        modifyRatesSuccess: receipt
      };
    }
    case actionTypes.tradeSuccess: {
      const { receipt } = action.payload;
      return {
        ...state,
        tradeSuccess: receipt
      };
    }
    case actionTypes.WITHDRAW_BUTTON_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        withdrawTokenButtonTransactionHash: transactionHash
      };
    }
    case actionTypes.DEPOSIT_ETHER_BUTTON_SPINNING: {
      const { receipt } = action.payload;
      return {
        ...state,
        depositEtherButtonSpinning: receipt
      };
    }
    case actionTypes.DEPOSIT_ETHER_SUCCESS: {
      const { receipt } = action.payload;
      return {
        ...state,
        depositEtherSuccess: receipt
      };
    }
    case actionTypes.DEPOSIT_ETHER_BUTTON_TRANSACTION_HASH_RECEIVED: {
      const { transactionHash } = action.payload;
      return {
        ...state,
        depositEtherButtonTransactionHash: transactionHash
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
