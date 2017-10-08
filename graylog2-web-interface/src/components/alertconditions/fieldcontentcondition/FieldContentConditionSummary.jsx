import React from 'react';

import GracePeriodSummary from 'components/alertconditions/GracePeriodSummary';
import BacklogSummary from 'components/alertconditions/BacklogSummary';
import RepeatNotificationsSummary from 'components/alertconditions/RepeatNotificationsSummary';

const FieldContentConditionSummary = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
  },
  _formatMatcher(field, value) {
    return <span>{`\<${field}: "${value}"\>`}</span>;
  },
  render() {
    const alertCondition = this.props.alertCondition;
    const field = alertCondition.parameters.field;
    const value = alertCondition.parameters.value;

    return (
      <span>
        告警被触发, 原因是接收到了匹配 {this._formatMatcher(field, value)} 的消息.
        {' '}
        <GracePeriodSummary alertCondition={alertCondition} />
        {' '}
        <BacklogSummary alertCondition={alertCondition} />
        {' '}
        <RepeatNotificationsSummary alertCondition={alertCondition} />
      </span>
    );
  },
});

export default FieldContentConditionSummary;
