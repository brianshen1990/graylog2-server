import React from 'react';
import Immutable from 'immutable';
import { Alert, Button, Col, ControlLabel, FormGroup, HelpBlock, Row } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import PermissionSelector from 'components/users/PermissionSelector';
import PermissionsMixin from 'util/PermissionsMixin';

const EditRole = React.createClass({
  propTypes: {
    initialRole: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    cancelEdit: React.PropTypes.func.isRequired,
    streams: React.PropTypes.object,
    dashboards: React.PropTypes.object,
  },

  mixins: [PermissionsMixin],

  getInitialState() {
    let role = this.props.initialRole;
    if (role === null) {
      // for the create dialog
      role = { name: null, description: null, permissions: [] };
    }
    return {
      role: role,
      initialName: this._safeRoleName(this.props.initialRole),
    };
  },

  componentWillReceiveProps(newProps) {
    this.setState({ role: newProps.initialRole, initialName: this._safeRoleName(newProps.initialRole) });
  },

  _safeRoleName(role) {
    return role === null ? null : role.name;
  },

  _setName(ev) {
    const role = this.state.role;
    role.name = ev.target.value;
    this.setState({ role: this.state.role });
  },
  _setDescription(ev) {
    const role = this.state.role;
    role.description = ev.target.value;
    this.setState({ role: this.state.role });
  },

  _updatePermissions(addedPerms, deletedPerms) {
    const role = this.state.role;
    role.permissions = Immutable.Set(role.permissions)
      .subtract(deletedPerms)
      .union(addedPerms)
      .toJS();
    this.setState({ role: role });
  },

  _saveDisabled() {
    return this.state.role === null || this.state.role.name === null || this.state.role.name === '' || this.state.role.permissions.length === 0;
  },

  _onSave() {
    this.props.onSave(this.state.initialName, this.state.role);
  },

  render() {
    let titleText;
    if (this.state.initialName === null) {
      titleText = '创建角色';
    } else {
      titleText = `修改角色 ${this.state.initialName}`;
    }

    const saveDisabled = this._saveDisabled();
    let saveDisabledAlert = null;
    if (saveDisabled) {
      saveDisabledAlert = (
        <Alert bsStyle="warning" style={{ marginBottom: 10 }}>
          为角色命名，并且指定对应权限给角色.
        </Alert>
      );
    }

    return (
      <Row>
        <Col md={12}>
          <h1>{titleText}</h1>
          <div style={{ marginTop: 10 }}>
            <Input id="role-name" type="text" label="名称" onChange={this._setName} value={this.state.role.name}
                   required />
            <Input id="role-description" type="text" label="描述" onChange={this._setDescription}
                   value={this.state.role.description} />

            <FormGroup>
              <ControlLabel>权限</ControlLabel>
              <HelpBlock>为此角色分配权限</HelpBlock>
            </FormGroup>
            <PermissionSelector streams={this.props.streams}
                                dashboards={this.props.dashboards}
                                permissions={Immutable.Set(this.state.role.permissions)}
                                onChange={this._updatePermissions}
            />
            <hr />
            {saveDisabledAlert}
            <Button onClick={this._onSave} style={{ marginRight: 5 }} bsStyle="primary" disabled={saveDisabled}>
              保存
            </Button>
            <Button onClick={this.props.cancelEdit}>取消</Button>
          </div>
        </Col>
      </Row>);
  },
});

export default EditRole;
