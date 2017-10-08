import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Routes from 'routing/Routes';

import DocsHelper from 'util/DocsHelper';
import { DocumentTitle, PageHeader } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndexSetsComponent } from 'components/indices';

const IndicesPage = React.createClass({
  render() {
    const pageHeader = (
      <PageHeader title="分片 & 索引集">
        <span>
          xxxx 日志平台 会将消息写入索引集。比如，可以配置索引集的失效时间。.
        </span>

        <span>
          <LinkContainer to={Routes.SYSTEM.INDEX_SETS.CREATE}>
            <Button bsStyle="success" bsSize="lg">新建索引集</Button>
          </LinkContainer>
        </span>
      </PageHeader>
    );

    return (
      <DocumentTitle title="Indices and Index Sets">
        <span>
          {pageHeader}

          <Row className="content">
            <Col md={12}>
              <IndexSetsComponent />
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default IndicesPage;
