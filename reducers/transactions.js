import merge from 'lodash/object/merge';
import {
  TRANSACTIONS_SUCCESS,
  TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_SUCCESS
} from '../actions/transactions';

const initialState = {};

export default function transactions(state = initialState, action) {

  switch (action.type) {

    case TRANSACTIONS_SUCCESS:
    case TRANSACTION_SUCCESS:
      return merge({}, state, action.response.transactions);

    case CREATE_TRANSACTION_SUCCESS:
      console.log('CREATE_TRANSACTION_SUCCESS', state);
      return state;
    default:
      return state;
  }
}

