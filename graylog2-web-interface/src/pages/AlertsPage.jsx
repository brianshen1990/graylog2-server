import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { AlertsComponent } from 'components/alerts';

import DocumentationLink from 'components/support/DocumentationLink';
import { DocumentTitle, PageHeader } from 'components/common';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const AlertsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="告警">
        <div>
          <PageHeader title="告警概览">
            <span>
              在满足您定义条件的情况下，告警会被触发。 一旦条件改变，告警会自动重新计算。
            </span>

            <span>
              <LinkContainer to={Routes.ALERTS.CONDITIONS}>
                <Button bsStyle="info">管理 条件</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.ALERTS.NOTIFICATIONS}>
                <Button bsStyle="info">管理 通知</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <AlertsComponent />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default AlertsPage;
