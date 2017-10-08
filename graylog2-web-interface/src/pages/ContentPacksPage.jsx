import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Routes from 'routing/Routes';

import { DocumentTitle, PageHeader } from 'components/common';
import ConfigurationBundles from 'components/source-tagging/ConfigurationBundles';

const ContentPacksPage = React.createClass({
  render() {
    return (
      <DocumentTitle title="内容包">
        <span>
          <PageHeader title="内容包">
            <span>
              内容包可以加速您的配置。内容包可以包括输入，提取器, 数据流和面板。
            </span>


            <LinkContainer to={Routes.SYSTEM.CONTENTPACKS.EXPORT}>
              <Button bsStyle="success" bsSize="large">创建内容包</Button>
            </LinkContainer>
          </PageHeader>

          <Row className="content">
            <Col md={12}>

              <h2>选择内容包</h2>
              <div id="react-configuration-bundles">
                <ConfigurationBundles />
              </div>
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default ContentPacksPage;
