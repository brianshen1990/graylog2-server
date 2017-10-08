import React, { PropTypes } from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const MetricsStore = StoreProvider.getStore('Metrics');

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { MetricsComponent } from 'components/metrics';

const ShowMetricsPage = React.createClass({
  propTypes: {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(NodesStore), Reflux.connect(MetricsStore), Reflux.listenTo(NodesStore, '_getMetrics')],

  _getMetrics() {
    MetricsActions.names();
  },

  render() {
    if (!this.state.nodes || !this.state.metricsNames) {
      return <Spinner />;
    }

    let nodeId = this.props.params.nodeId;
    // "master" node ID is a placeholder for master node, get first master node ID
    if (nodeId === 'master') {
      const nodeIDs = Object.keys(this.state.nodes);
      const masterNodes = nodeIDs.filter(nodeID => this.state.nodes[nodeID].is_master);
      nodeId = masterNodes[0] || nodeIDs[0];
    }

    const node = this.state.nodes[nodeId];
    const title = <span>节点 {node.short_node_id} / {node.hostname} 度量</span>;
    const namespace = MetricsStore.namespace;
    const names = this.state.metricsNames[nodeId];
    const filter = this.props.location.query.filter;
    return (
      <DocumentTitle title={`节点 ${node.short_node_id} / ${node.hostname} 度量`}>
        <span>
          <PageHeader title={title}>
            <span>
              所有的节点都会提供内部的度量，以便您分析、调试和监控。您也可以通过JMX去获取这些度量值。
            </span>
            <span>本节点正在报告{names.length} 个度量.</span>
          </PageHeader>

          <MetricsComponent names={names} namespace={namespace} nodeId={nodeId} filter={filter} />
        </span>
      </DocumentTitle>
    );
  },
});

export default ShowMetricsPage;
