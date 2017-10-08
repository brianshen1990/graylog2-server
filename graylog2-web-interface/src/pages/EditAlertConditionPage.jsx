import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { ConditionAlertNotifications, EditAlertConditionForm } from 'components/alertconditions';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

import CombinedProvider from 'injection/CombinedProvider';
const { CurrentUserStore } = CombinedProvider.get('CurrentUser');
const { StreamsStore } = CombinedProvider.get('Streams');
const { AlertConditionsStore, AlertConditionsActions } = CombinedProvider.get('AlertConditions');

const EditAlertConditionPage = React.createClass({
  propTypes: {
    params: React.PropTypes.object.isRequired,
  },

  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(AlertConditionsStore)],

  getInitialState() {
    return {
      stream: undefined,
    };
  },

  componentDidMount() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({ stream: stream });
    });

    AlertConditionsActions.get(this.props.params.streamId, this.props.params.conditionId);
  },

  _isLoading() {
    return !this.state.stream || !this.state.alertCondition;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const condition = this.state.alertCondition;
    const stream = this.state.stream;

    return (
      <DocumentTitle title={`告警条件 ${condition.title || '未命名'}`}>
        <div>
          <PageHeader title={<span>告警条件 <em>{condition.title || '未命名'}</em></span>}>
            <span>
              定义告警条件, 系统在满足条件的情况下将会给您通知.
            </span>

            <span>
              <LinkContainer to={Routes.ALERTS.CONDITIONS}>
                <Button bsStyle="info">管理告警条件</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.ALERTS.NOTIFICATIONS}>
                <Button bsStyle="info">管理告警通知</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <EditAlertConditionForm alertCondition={condition} stream={stream} />
            </Col>
          </Row>

          <Row className="content">
            <Col md={12}>
              <ConditionAlertNotifications alertCondition={condition} stream={stream} />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default EditAlertConditionPage;
