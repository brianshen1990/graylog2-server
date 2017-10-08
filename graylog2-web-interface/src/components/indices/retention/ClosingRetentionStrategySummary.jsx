import React from 'react';

const ClosingRetentionStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl>
          <dt>索引保存策略:</dt>
          <dd>关闭</dd>
          <dt>最大索引数目:</dt>
          <dd>{this.props.config.max_number_of_indices}</dd>
        </dl>
      </div>
    );
  },
});

export default ClosingRetentionStrategySummary;
