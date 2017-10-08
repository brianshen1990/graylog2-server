import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import { Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');

const GraylogClusterOverview = React.createClass({
  mixins: [Reflux.connect(NodesStore)],

  _isLoading() {
    return !this.state.nodes;
  },

  render() {
    let content = <Spinner />;

    if (!this._isLoading()) {
      content = (
        <dl className="system-dl" style={{ marginBottom: 0 }}>
          <dt>集群 ID:</dt>
          <dd>{this.state.clusterId || '无可用'}</dd>
          <dt>Nodes数目:</dt>
          <dd>{this.state.nodeCount}</dd>
        </dl>
      );
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2 style={{ marginBottom: 10 }}>xxxx 日志平台 集群</h2>
          {content}
        </Col>
      </Row>
    );
  },
});

export default GraylogClusterOverview;
