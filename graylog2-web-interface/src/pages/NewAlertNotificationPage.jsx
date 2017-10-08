import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { DocumentTitle, PageHeader } from 'components/common';
import { CreateAlertNotificationInput } from 'components/alertnotifications';

import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const NewAlertNotificationPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="创建告警通知">
        <div>
          <PageHeader title="创建告警通知">
            <span>
              创建告警通知，这样您就不会错过任何一条告警。
            </span>

            <span>
              请将告警通知制定给一条告警条件。
            </span>

            <span>
              <LinkContainer to={Routes.ALERTS.NOTIFICATIONS}>
                <Button bsStyle="info">管理消息</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <CreateAlertNotificationInput />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default NewAlertNotificationPage;
