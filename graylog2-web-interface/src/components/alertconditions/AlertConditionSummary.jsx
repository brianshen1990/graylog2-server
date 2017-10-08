import React from 'react';
import { Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Routes from 'routing/Routes';

import { EntityListItem } from 'components/common';

import { GenericAlertConditionSummary } from 'components/alertconditions';
import { PluginStore } from 'graylog-web-plugin/plugin';

const AlertConditionSummary = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
    typeDefinition: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object,
    actions: React.PropTypes.array.isRequired,
    linkToDetails: React.PropTypes.bool,
  },

  render() {
    const stream = this.props.stream;
    const condition = this.props.alertCondition;
    const typeDefinition = this.props.typeDefinition;
    const conditionType = PluginStore.exports('alertConditions').find(c => c.type === condition.type) || {};
    const SummaryComponent = conditionType.summaryComponent || GenericAlertConditionSummary;

    const description = (stream ?
      <span>告警在数据流 <em>{stream.title}</em></span> : '没有在任何数据流上告警');

    const content = (
      <Col md={12}>
        <strong>配置:</strong> <SummaryComponent alertCondition={condition} />
      </Col>
    );

    let title;
    if (this.props.linkToDetails) {
      title = (
        <LinkContainer to={Routes.show_alert_condition(stream.id, condition.id)}>
          <a>{condition.title ? condition.title : '未命名'}</a>
        </LinkContainer>
      );
    } else {
      title = (condition.title ? condition.title : '未命名');
    }

    return (
      <EntityListItem key={`entry-list-${condition.id}`}
                      title={title}
                      titleSuffix={`(${typeDefinition.name})`}
                      description={description}
                      actions={this.props.actions}
                      contentRow={content} />
    );
  },
});

export default AlertConditionSummary;
