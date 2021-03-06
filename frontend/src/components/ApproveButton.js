import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';
import Icon from './Icon';

// Leave non shallow until proper way of testing them
class ApproveButton extends Component {
  render() {
    const {
      approveExpense,
      inProgress,
      disabled,
      isManual,
      approved
    } = this.props;

    let label = 'Approve and pay';

    if (isManual) {
      label = 'Approve';
    } else if (approved) {
      label = 'Pay';
    }

    return (
      <div>
        <AsyncButton
          customClass='Button--approve'
          inProgress={inProgress}
          disabled={disabled}
          onClick={approveExpense.bind(this)}>
          <Icon type='approved' /> {label}
        </AsyncButton>
      </div>
    );
  }
}

ApproveButton.propTypes = {
  approveExpense: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ApproveButton;
