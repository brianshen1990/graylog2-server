import React from 'react';

import GracePeriodSummary from 'components/alertconditions/GracePeriodSummary';
import BacklogSummary from 'components/alertconditions/BacklogSummary';
import RepeatNotificationsSummary from 'components/alertconditions/RepeatNotificationsSummary';
import { Pluralize } from 'components/common';

const MessageCountConditionSummary = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
  },
  render() {
    const alertCondition = this.props.alertCondition;
    const threshold = alertCondition.parameters.threshold;
    const thresholdType = alertCondition.parameters.threshold_type.toLowerCase();
    const time = alertCondition.parameters.time;

    return (
      <span>
        告警触发的情况是
        {' '}
        <Pluralize value={threshold} singular={`收到 ${thresholdType} 于一条信息`}
                   plural={`收到 ${thresholdType} 于 ${threshold} 条信息`} />
        {' '}in the{' '}
        <Pluralize value={time} singular="最近 1 分钟" plural={`最近 ${time} 分钟`} />.
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

export default MessageCountConditionSummary;
