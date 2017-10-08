import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import { DocumentTitle, PageHeader } from 'components/common';
import { CreateAlertConditionInput } from 'components/alertconditions';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const NewAlertConditionPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="创建新的告警条件">
        <div>
          <PageHeader title="创建新的告警条件">
            <span>
              在此定义您的告警条件。
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
              <CreateAlertConditionInput />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default NewAlertConditionPage;
