import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Create a new expense in a group
 */

export default (groupid, expense) => {
  const url = `groups/${groupid}/expenses/`;

  expense.amount = expense.amount*100;
  return dispatch => {
    dispatch(request(groupid, expense));
    return postJSON(url, {expense})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error))
        throw new Error(error.message);
      });
  };
};

function request(groupid, expense) {
  return {
    type: constants.CREATE_EXPENSE_REQUEST,
    groupid,
    expense
  };
}

function success(groupid, expense) {
  const expenses = {
    [expense.id]: expense
  };

  return {
    type: constants.CREATE_EXPENSE_SUCCESS,
    groupid,
    expenses,
  };
}

function failure(error) {
  return {
    type: constants.CREATE_EXPENSE_FAILURE,
    error,
  };
}
