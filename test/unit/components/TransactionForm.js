import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import TransactionForm from '../../../frontend/src/components/TransactionForm';

const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

chai.use(spies);

describe('TransactionForm component', () => {
  const noop = () => {};
  const resetTransactionForm = chai.spy(noop);
  const appendTransactionForm = chai.spy(noop);

  beforeEach(() => {
    const props = {
      transaction: { attributes: {}, error: {} },
      group: { currency: 'USD' },
      tags: ['a', 'b'],
      resetTransactionForm,
      appendTransactionForm,
      resetNotifications: () => {},
      notification: {}
    };

    const rendered = renderIntoDocument(<TransactionForm {...props} />);
    findRenderedDOMComponentWithClass(rendered, 'js-form');
  });

  it('should reset the form on mount', () => {
    expect(resetTransactionForm).to.have.been.called();
  });
});
