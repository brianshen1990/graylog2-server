import React from 'react';
import { Col, Row } from 'react-bootstrap';
import numeral from 'numeral';
import moment from 'moment';

import StoreProvider from 'injection/StoreProvider';
const IndexerFailuresStore = StoreProvider.getStore('IndexerFailures');

import DocsHelper from 'util/DocsHelper';

import { DocumentTitle, Spinner, PageHeader, PaginatedList } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndexerFailuresList } from 'components/indexers';

const IndexerFailuresPage = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    IndexerFailuresStore.count(moment().subtract(10, 'years')).then((response) => {
      this.setState({ total: response.count });
    });
    this.loadData(1, this.defaultPageSize);
  },
  defaultPageSize: 50,
  loadData(page, size) {
    IndexerFailuresStore.list(size, (page - 1) * size).then((response) => {
      this.setState({ failures: response.failures });
    });
  },
  _onChangePaginatedList(page, size) {
    this.loadData(page, size);
  },
  render() {
    if (this.state.total === undefined || !this.state.failures) {
      return <Spinner />;
    }
    return (
      <DocumentTitle title="Indexer 失败">
        <span>
          <PageHeader title="Indexer 失败">
            <span>
              该页显示索引尝试失败。失败意味着消息已被处理，{' '}
              但是没有被正确写入Elasticsearch 集群.最多保存{' '}
              50 MB 失败数据，这意味着不是所有的失败数目都能看见. .
            </span>

            <span>
              共包含 {numeral(this.state.total).format('0,0')} 条indexer 失败.
            </span>
          </PageHeader>
          <Row className="content">
            <Col md={12}>
              <PaginatedList totalItems={this.state.total} onChange={this._onChangePaginatedList} pageSize={this.defaultPageSize}>
                <IndexerFailuresList failures={this.state.failures} />
              </PaginatedList>
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default IndexerFailuresPage;
