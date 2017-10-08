import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Routes from 'routing/Routes';

import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const RolesStore = StoreProvider.getStore('Roles');
const UsersStore = StoreProvider.getStore('Users');

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import NewUserForm from 'components/users/NewUserForm';

const CreateUsersPage = React.createClass({

  propTypes: {
    history: React.PropTypes.object,
  },

  getInitialState() {
    return {
      roles: undefined,
    };
  },

  componentDidMount() {
    RolesStore.loadRoles().then((roles) => {
      this.setState({ roles: roles });
    });
  },

  _onSubmit(r) {
    const request = r;
    request.permissions = [];
    delete request['session-timeout-never'];
    UsersStore.create(request).then(() => {
      UserNotification.success(`用户 ${request.username} 创建成功.`, '成功!');
      this.props.history.replaceState(null, Routes.SYSTEM.AUTHENTICATION.USERS.LIST);
    }, () => {
      UserNotification.error('创建用户失败!', '错误!');
    });
  },

  _onCancel() {
    this.props.history.pushState(null, Routes.SYSTEM.AUTHENTICATION.USERS.LIST);
  },

  render() {
    if (!this.state.roles) {
      return <Spinner />;
    }
    return (
      <DocumentTitle title="创建新用户">
        <span>
          <PageHeader title="创建新用户" subpage>
            <span>
              在此页创建新用户。在此创建的用户和权限将不会限制在网页访问，他们也可以访问节点信息。
            </span>
          </PageHeader>
          <Row>
            <Col lg={8}>
              <NewUserForm roles={this.state.roles} onSubmit={this._onSubmit} onCancel={this._onCancel} />
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default CreateUsersPage;
