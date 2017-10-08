import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const InputStatesStore = StoreProvider.getStore('InputStates');

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { InputsList } from 'components/inputs';

import Routes from 'routing/Routes';

function nodeFilter(state) {
  return state.nodes ? state.nodes[this.props.params.nodeId] : state.nodes;
}

const NodeInputsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connectFilter(NodesStore, 'node', nodeFilter)],
  componentDidMount() {
    this.interval = setInterval(InputStatesStore.list, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  _isLoading() {
    return !this.state.node;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const title = <span>Inputs of node {this.state.node.short_node_id} / {this.state.node.hostname}</span>;

    return (
      <DocumentTitle title={`节点 ${this.state.node.short_node_id} / ${this.state.node.hostname} 的输入`}>
        <div>
          <PageHeader title={title}>
            <span>xxxx 日志平台 节点通过输入接收数据。 本页您将看到那些输入在特定节点上运行。</span>

            <span>
              您可以在<LinkContainer to={Routes.SYSTEM.INPUTS}><a>这里</a></LinkContainer>开启或者结束集群上的输入。
            </span>
          </PageHeader>
          <InputsList permissions={this.state.currentUser.permissions} node={this.state.node} />
        </div>
      </DocumentTitle>
    );
  },
});

export default NodeInputsPage;
