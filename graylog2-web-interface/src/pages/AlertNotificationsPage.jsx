import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { DocumentTitle, PageHeader } from 'components/common';
import { AlertNotificationsComponent } from 'components/alertnotifications';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const AlertNotificationsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="告警通知">
        <div>
          <PageHeader title="管理告警通知">
            <span>
              告警会时刻让您知晓告警条件的状态。xxxx 日志平台会直接发给您。
            </span>

            <span>
              别忘记将告警通知制定给告警条件。
            </span>

            <span>
              <LinkContainer to={Routes.ALERTS.CONDITIONS}>
                <Button bsStyle="info">管理告警条件</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <AlertNotificationsComponent />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default AlertNotificationsPage;
