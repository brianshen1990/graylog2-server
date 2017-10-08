import React from 'react';
import Reflux from 'reflux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import EditDashboardModalTrigger from './EditDashboardModalTrigger';
import PermissionsMixin from 'util/PermissionsMixin';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const DashboardsStore = StoreProvider.getStore('Dashboards');
const StartpageStore = StoreProvider.getStore('Startpage');

import Routes from 'routing/Routes';

const Dashboard = React.createClass({
  propTypes: {
    dashboard: React.PropTypes.object,
    permissions: React.PropTypes.arrayOf(React.PropTypes.string),
  },
  mixins: [PermissionsMixin, Reflux.connect(CurrentUserStore)],
  _setStartpage() {
    StartpageStore.set(this.state.currentUser.username, 'dashboard', this.props.dashboard.id);
  },
  _onDashboardDelete() {
    if (window.confirm(`确定删除面板 ${this.props.dashboard.title}?`)) {
      DashboardsStore.remove(this.props.dashboard);
    }
  },
  _getDashboardActions() {
    let dashboardActions;
    const setAsStartpageMenuItem = (
      <MenuItem onSelect={this._setStartpage} disabled={this.state.currentUser.read_only}>设置为起始页</MenuItem>
    );

    if (this.isPermitted(this.props.permissions, [`dashboards:edit:${this.props.dashboard.id}`])) {
      dashboardActions = (
        <div className="stream-actions">
          <EditDashboardModalTrigger id={this.props.dashboard.id} action="edit" title={this.props.dashboard.title}
                                     description={this.props.dashboard.description} buttonClass="btn-info" />
          &nbsp;
          <DropdownButton title="更多操作" pullRight id={`more-actions-dropdown-${this.props.dashboard.id}`}>
            {setAsStartpageMenuItem}
            <MenuItem divider />
            <MenuItem onSelect={this._onDashboardDelete}>删除此面板</MenuItem>
          </DropdownButton>
        </div>
      );
    } else {
      dashboardActions = (
        <div className="stream-actions">
          <DropdownButton title="更多操作" pullRight id={`more-actions-dropdown-${this.props.dashboard.id}`}>
            {setAsStartpageMenuItem}
          </DropdownButton>
        </div>
      );
    }

    return dashboardActions;
  },
  render() {
    const createdFromContentPack = (this.props.dashboard.content_pack ?
      <i className="fa fa-cube" title="创建内容包" /> : null);

    return (
      <li className="stream">
        <h2>
          <LinkContainer to={Routes.dashboard_show(this.props.dashboard.id)}>
            <a><span ref="dashboardTitle">{this.props.dashboard.title}</span></a>
          </LinkContainer>
        </h2>

        <div className="stream-data">
          {this._getDashboardActions()}
          <div className="stream-description">
            {createdFromContentPack}
            <span ref="dashboardDescription">{this.props.dashboard.description}</span>
          </div>
        </div>
      </li>
    );
  },
});

export default Dashboard;
