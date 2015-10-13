import React, { Component, findDOMNode } from 'react';

class MoneyInput extends Component {
  propTypes: {
    labelText: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired
  }

  render() {
    const { labelText } = this.props;

    return (
      <div className='MoneyInput'>
        <label className='Label'>{labelText}:</label>
        <input
          className='Field Field--MoneyInput'
          placeholder='$ 10.00'
          type='text'
          ref='input'
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }

  handleChange() {
    const { handleChange } = this.props;
    const value = findDOMNode(this.refs.input).value;
    handleChange(value);
  }
}

export default MoneyInput;