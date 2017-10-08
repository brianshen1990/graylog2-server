import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import PermissionsMixin from 'util/PermissionsMixin';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import { DocumentTitle, IfPermitted, PageHeader } from 'components/common';
import UserList from 'components/users/UserList';

const UsersPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), PermissionsMixin],
  render() {
    return (
      <DocumentTitle title="认证">
        <span>
          <PageHeader title="用户账户" subpage>
            <span>创建任意多的用户.你也可以对现有用户进行修改.</span>
            {null}
            <span>
              <IfPermitted permissions="users:edit">
                <LinkContainer to={Routes.SYSTEM.AUTHENTICATION.USERS.CREATE}>
                  <Button bsStyle="success">添加新用户</Button>
                </LinkContainer>
              </IfPermitted>
            </span>
          </PageHeader>

          <Row>
            <Col md={12}>
              <UserList currentUsername={this.state.currentUser.username} currentUser={this.state.currentUser} />
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default UsersPage;
