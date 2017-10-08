import React, { PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import URI from 'urijs';

import { IfPermitted } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const SystemProcessingStore = StoreProvider.getStore('SystemProcessing');
const SystemLoadBalancerStore = StoreProvider.getStore('SystemLoadBalancer');
const SystemShutdownStore = StoreProvider.getStore('SystemShutdown');

import Routes from 'routing/Routes';

const NodesActions = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
  },
  _toggleMessageProcessing() {
    if (confirm(`您将要 ${this.props.systemOverview.is_processing ? '停止' : '恢复'} 本节点的消息处理程序. 确定?`)) {
      if (this.props.systemOverview.is_processing) {
        SystemProcessingStore.pause(this.props.node.node_id);
      } else {
        SystemProcessingStore.resume(this.props.node.node_id);
      }
    }
  },
  _changeLBStatus(status) {
    return () => {
      if (confirm(` 您将要改变本节点均衡器的状态为 ${status}. 确定?`)) {
        SystemLoadBalancerStore.override(this.props.node.node_id, status);
      }
    };
  },
  _shutdown() {
    if (prompt('确定讲下停止该节点?? 如需停止，请输入 "SHUTDOWN".') === 'SHUTDOWN') {
      SystemShutdownStore.shutdown(this.props.node.node_id);
    }
  },
  render() {
    const apiBrowserURI = new URI(`${this.props.node.transport_address}/api-browser`).normalizePathname().toString();
    return (
      <div className="item-actions">
        <LinkContainer to={Routes.SYSTEM.NODES.SHOW(this.props.node.node_id)}>
          <Button bsStyle="info">详情</Button>
        </LinkContainer>

        <LinkContainer to={Routes.SYSTEM.METRICS(this.props.node.node_id)}>
          <Button bsStyle="info">度量</Button>
        </LinkContainer>

        <Button bsStyle="info" href={apiBrowserURI} target="_blank">
          <i className="fa fa-external-link" />&nbsp; API查看
        </Button>

        <DropdownButton title="更多操作" id={`more-actions-dropdown-${this.props.node.node_id}`} pullRight>
          <IfPermitted permissions="processing:changestate">
            <MenuItem onSelect={this._toggleMessageProcessing}>
              {this.props.systemOverview.is_processing ? '停止' : '恢复'} 消息处理
            </MenuItem>
          </IfPermitted>

          <IfPermitted permissions="lbstatus:change">
            <li className="dropdown-submenu left-submenu">
              <a href="#">覆盖均衡器状态</a>
              <ul className="dropdown-menu">
                <MenuItem onSelect={this._changeLBStatus('ALIVE')}>存活</MenuItem>
                <MenuItem onSelect={this._changeLBStatus('DEAD')}>消亡</MenuItem>
              </ul>
            </li>
          </IfPermitted>

          <IfPermitted permissions="node:shutdown">
            <MenuItem onSelect={this._shutdown}>停机</MenuItem>
          </IfPermitted>

          <IfPermitted permissions={['processing:changestate', 'lbstatus:change', 'node:shutdown']} anyPermissions>
            <IfPermitted permissions={['inputs:read', 'threads:dump']} anyPermissions>
              <MenuItem divider />
            </IfPermitted>
          </IfPermitted>

          <IfPermitted permissions="inputs:read">
            <LinkContainer to={Routes.node_inputs(this.props.node.node_id)}>
              <MenuItem>本地消息输入</MenuItem>
            </LinkContainer>
          </IfPermitted>
          <IfPermitted permissions="threads:dump">
            <LinkContainer to={Routes.SYSTEM.THREADDUMP(this.props.node.node_id)}>
              <MenuItem>获得线程dump</MenuItem>
            </LinkContainer>
          </IfPermitted>
        </DropdownButton>
      </div>
    );
  },
});

export default NodesActions;
