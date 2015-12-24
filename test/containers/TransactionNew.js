import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import { createExpense, TransactionNew } from '../../containers/TransactionNew';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  Simulate,
  renderIntoDocument
} = TestUtils;

const createElement = (props) => {
  const rendered = renderIntoDocument(<TransactionNew {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'TransactionForm');
};

chai.use(spies);

describe('TransactionNew container', () => {

  it('should reset form on mount', () => {
      const handler = chai.spy(() => {});
      const transaction = {
        attributes: {},
        error: {}
      };

      createElement({
        transaction,
        tags: [],
        resetNotifications: () => {},
        notification: {},
        fetchGroup: () => {},
        group: {id: 1, currency: 'USD' },
        resetTransactionForm: handler
      });
      expect(handler).to.have.been.called();
  });

  it('should create an expense an invert the sign', (done) => {
    const props = {
      group: {id: 1, currency: 'USD' },
      createTransaction
    };
    const amount = 10;

    createExpense.call({props}, {amount});

    function createTransaction(groupid, transaction) {
      expect(transaction.amount).to.be.equal(-amount);
      done();
      return Promise.resolve();
    }
  });

});
