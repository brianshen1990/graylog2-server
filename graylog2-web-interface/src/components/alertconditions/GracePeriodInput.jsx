import React from 'react';

import { Pluralize } from 'components/common';

const GracePeriodInput = React.createClass({
  propTypes: {
    parameters: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      grace: this.props.parameters.grace,
      backlog: this.props.parameters.backlog,
    };
  },
  getValue() {
    return this.state;
  },
  _onChange(event) {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  },
  render() {
    return (
      <span>
        并且 <br /> 等待至少{' '}
        <input ref="grace" name="grace" type="number" min="0" className="form-control"
               value={this.state.grace} onChange={this._onChange} required />
        {' '}
        <Pluralize singular="分钟" plural="分钟" value={this.state.grace} /> 直到触发一条新的告警. (宽限期)
        <br />

        当发送一条告警时, 包括数据流中最近的{' '}
        <input ref="backlog" name="backlog" type="number" min="0" className="form-control"
               value={this.state.backlog} onChange={this._onChange} required />
        {' '}
        <Pluralize singular="条消息" plural="条消息" value={this.state.backlog} />.
      </span>
    );
  },
});

export default GracePeriodInput;
