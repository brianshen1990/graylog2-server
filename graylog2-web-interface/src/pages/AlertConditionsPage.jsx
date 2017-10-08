import React from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import { DocumentTitle, PageHeader } from 'components/common';
import { AlertConditionsComponent } from 'components/alertconditions';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const AlertConditionsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="告警条件">
        <div>
          <PageHeader title="管理告警条件">
            <span>
              告警条件定义了您需要注意的情况。 xxxx 日志平台会定期的检查这些条件， 并且在状态改变的时候通知您。
            </span>


            <span>
              <LinkContainer to={Routes.ALERTS.NOTIFICATIONS}>
                <Button bsStyle="info">管理通知</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <AlertConditionsComponent />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default AlertConditionsPage;
