import React from 'react';

const MessageCountRotationStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl>
          <dt>索引循环策略:</dt>
          <dd>消息数</dd>
          <dt>每个索引的最大消息数:</dt>
          <dd>{this.props.config.max_docs_per_index}</dd>
        </dl>
      </div>
    );
  },
});

export default MessageCountRotationStrategySummary;
