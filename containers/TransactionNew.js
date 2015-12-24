import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import rejectError from '../lib/reject_error';

import fetchGroup from '../actions/groups/fetch_by_id';
import createTransaction from '../actions/transactions/create';
import resetTransactionForm from '../actions/form/reset_transaction';
import appendTransactionForm from '../actions/form/append_transaction';
import validateTransaction from '../actions/form/validate_transaction';
import uploadImage from '../actions/images/upload';
import notify from '../actions/notification/notify';
import resetNotifications from '../actions/notification/reset';

import tags from '../ui/tags';
import Content from './Content';

import TransactionForm from '../components/TransactionForm';
import Header from '../components/Header';

export class TransactionNew extends Component {
  render() {
    return (
      <div>
        <Header
          title='Submit Expense'
          backLink={`/groups/${this.props.groupid}/transactions/`} />
        <Content>
          <TransactionForm
            {...this.props}
            handleSubmit={this.handleSubmit.bind(this)} />
        </Content>
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchGroup(this.props.groupid);
  }

  handleSubmit(transaction) {
    const { notify, groupid, pushState } = this.props;

    return createExpense.call(this, transaction)
    .then(() => pushState(null, `/groups/${groupid}/transactions`))
    .catch(error => notify('error', error.message));
  }
};

/**
 * Export methods for testing
 */

export function createExpense(transaction) {
  const {
    group,
    createTransaction
  } = this.props;

  // An expense is a negative transaction in the backend
  return createTransaction(group.id, {...transaction, amount: -transaction.amount, currency: group.currency })
  .then(rejectError.bind(this, 'requestError'));
}

export default connect(mapStateToProps, {
  createTransaction,
  uploadImage,
  resetTransactionForm,
  appendTransactionForm,
  validateTransaction,
  pushState,
  notify,
  fetchGroup,
  resetNotifications
})(TransactionNew);

function mapStateToProps({router, form, transactions, notification, images, groups}) {
  const transaction = form.transaction;
  const groupid = router.params.groupid;
  
  return {
    groupid,
    group: groups[groupid] || {},
    notification,
    transaction,
    tags: tags(groupid),
    isUploading: images.isUploading || false,
    validationError: form.transaction.error,
    requestError: transactions.error
  };
}
