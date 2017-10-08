import React from 'react';

const DeletionRetentionStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl>
          <dt>索引保留策略:</dt>
          <dd>删除</dd>
          <dt>最大索引数量:</dt>
          <dd>{this.props.config.max_number_of_indices}</dd>
        </dl>
      </div>
    );
  },
});

export default DeletionRetentionStrategySummary;
