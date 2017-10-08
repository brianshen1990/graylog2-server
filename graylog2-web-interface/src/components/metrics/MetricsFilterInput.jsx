import React from 'react';

const MetricsFilterInput = React.createClass({
  render() {
    return (
      <input type="text" className="metrics-filter input-lg form-control"
             style={{ width: '100%' }} placeholder="输入关键字以便筛选..." {...this.props} />
    );
  },
});

export default MetricsFilterInput;
