import React from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import RolesSelect from 'components/users/RolesSelect';
import TimeoutInput from 'components/users/TimeoutInput';
import { TimezoneSelect } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const UsersStore = StoreProvider.getStore('Users');

import ValidationsUtils from 'util/ValidationsUtils';

const NewUserForm = React.createClass({
  propTypes: {
    roles: React.PropTypes.array.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      users: [],
      newRoles: null,
    };
  },

  componentDidMount() {
    UsersStore.loadUsers().then((users) => {
      this.setState({ users });
    });
  },

  _onUsernameChange(event) {
    const usernameField = this.refs.username.getInputDOMNode();
    const usernameExists = this.state.users.some(user => user.username === event.target.value);

    ValidationsUtils.setFieldValidity(usernameField, usernameExists, '用户名已存在');
  },

  _onPasswordChange() {
    const passwordField = this.refs.password;
    const passwordConfirmField = this.refs.password_repeat;

    if (passwordField.value !== '' && passwordConfirmField.value !== '') {
      ValidationsUtils.setFieldValidity(passwordConfirmField, passwordField.value !== passwordConfirmField.value, '密码不匹配');
    }
  },

  _onSubmit(evt) {
    evt.preventDefault();
    const result = {};
    Object.keys(this.refs).forEach((ref) => {
      if (ref !== 'password_repeat') {
        result[ref] = (this.refs[ref].getValue ? this.refs[ref].getValue() : this.refs[ref].value);
      }
    });

    this.props.onSubmit(result);
  },

  _onValueChange(newRoles) {
    const roles = newRoles.split(',');
    this.setState({ newRoles: roles });
  },

  render() {
    const rolesHelp = (
      <span className="help-block">
        指定相关的角色给这个用户，该用户会具有使用数据流和面板的权利.<br />
        <em>Reader</em> 角色能够获取基本资源.<br />
        <em>Admin</em> 角色能够获取整个系统资源.
      </span>
    );
    const roles = this.state.newRoles;
    let rolesAlert = null;
    if (roles != null && !(roles.includes('Reader') || roles.includes('Admin'))) {
      rolesAlert = (<Alert bsStyle="danger" role="alert">
        至少选择一个 <em>Reader</em> 或者 <em>Admin</em> 角色.
      </Alert>);
    }
    return (
      <form id="create-user-form" className="form-horizontal" onSubmit={this._onSubmit}>
        <Input ref="username" name="username" id="username" type="text" maxLength={100}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="用户名" help="输入一个唯一的用户名." required
               onChange={this._onUsernameChange} autoFocus />

        <Input ref="full_name" name="fullname" id="fullname" type="text" maxLength={200}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="全名" help="为此账户添加描述性名称." required />

        <Input ref="email" name="email" id="email" type="email" maxLength={254}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="Email" help="Email 地址." required />

        <Input label="密码"
               help="密码必须超过6位，推荐使用强密码."
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <Row>
            <Col sm={6}>
              <input className="form-control" ref="password" name="password" id="password" type="password"
                     placeholder="密码" required minLength="6" onChange={this._onPasswordChange} />
            </Col>
            <Col sm={6}>
              <input className="form-control" ref="password_repeat" id="password-repeat" type="password"
                     placeholder="再次输入密码" required minLength="6" onChange={this._onPasswordChange} />
            </Col>
          </Row>
        </Input>

        <Input label="角色" help={rolesHelp}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <RolesSelect ref="roles" availableRoles={this.props.roles} userRoles={['Reader']}
                       className="form-control" onValueChange={this._onValueChange} />
          {rolesAlert}
        </Input>

        <TimeoutInput ref="session_timeout_ms" />

        <Input label="时间区域" help="选择时间区域，默认使用系统时间."
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <TimezoneSelect ref="timezone" className="timezone-select" />
        </Input>

        <div className="form-group">
          <Col smOffset={2} sm={10}>
            <Button type="submit" bsStyle="primary" className="create-user save-button-margin" disabled={!!rolesAlert}>
              创建用户
            </Button>
            <Button onClick={this.props.onCancel}>取消</Button>
          </Col>
        </div>
      </form>
    );
  },
});

export default NewUserForm;
