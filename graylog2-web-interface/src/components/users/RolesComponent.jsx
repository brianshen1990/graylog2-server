import React from 'react';
import Immutable from 'immutable';
import { Button, Col, Row } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');
const DashboardsStore = StoreProvider.getStore('Dashboards');
const RolesStore = StoreProvider.getStore('Roles');

import UserNotification from 'util/UserNotification';
import RoleList from 'components/users/RoleList';
import EditRole from 'components/users/EditRole';
import PageHeader from 'components/common/PageHeader';

const RolesComponent = React.createClass({
  getInitialState() {
    return {
      roles: Immutable.Set(),
      rolesLoaded: false,
      editRole: null,
      streams: Immutable.List(),
      dashboards: Immutable.List(),
    };
  },
  componentDidMount() {
    this.loadRoles();
    StreamsStore.load(streams => this.setState({ streams: Immutable.List(streams) }));
    DashboardsStore.listDashboards().then(dashboards => this.setState({ dashboards: dashboards }));
  },

  loadRoles() {
    const promise = RolesStore.loadRoles();
    promise.then((roles) => {
      this.setState({ roles: Immutable.Set(roles), rolesLoaded: true });
    });
  },

  _showCreateRole() {
    this.setState({ showEditRole: true });
  },
  _showEditRole(role) {
    this.setState({ showEditRole: true, editRole: role });
  },
  _deleteRole(role) {
    if (window.confirm(`确定要删除角色 ${role.name}?`)) {
      RolesStore.getMembers(role.name).then((membership) => {
        if (membership.users.length !== 0) {
          UserNotification.error(`无法删除角色 ${role.name}. 已被分配给 ${membership.users.length} 个用户.`);
        } else {
          RolesStore.deleteRole(role.name).then(this.loadRoles);
        }
      });
    }
  },
  _saveRole(initialName, role) {
    if (initialName === null) {
      RolesStore.createRole(role).then(this._clearEditRole).then(this.loadRoles);
    } else {
      RolesStore.updateRole(initialName, role).then(this._clearEditRole).then(this.loadRoles);
    }
  },
  _clearEditRole() {
    this.setState({ showEditRole: false, editRole: null });
  },

  render() {
    let content = null;
    if (!this.state.rolesLoaded) {
      content = <span>Loading roles...</span>;
    } else if (this.state.showEditRole) {
      content =
        (<EditRole initialRole={this.state.editRole} streams={this.state.streams} dashboards={this.state.dashboards}
                  onSave={this._saveRole} cancelEdit={this._clearEditRole} />);
    } else {
      content = (<RoleList roles={this.state.roles}
                           showEditRole={this._showEditRole}
                           deleteRole={this._deleteRole} />);
    }

    let actionButton;
    if (!this.state.showEditRole) {
      actionButton = <Button bsStyle="success" onClick={this._showCreateRole}>添加新的角色</Button>;
    }
    return (
      <Row>
        <Col md={12}>
          <PageHeader title="角色" subpage>
            <span>
              角色和一系列的权限绑定，可将该角色制定给任意多的用户
            </span>
            {null}
            <span>
              {actionButton}
            </span>
          </PageHeader>

          {content}
        </Col>
      </Row>
    );
  },
});

export default RolesComponent;
