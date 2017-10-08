import React from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';

import { DataTable } from 'components/common';

const RoleList = React.createClass({
  propTypes: {
    roles: React.PropTypes.instanceOf(Immutable.Set).isRequired,
    showEditRole: React.PropTypes.func.isRequired,
    deleteRole: React.PropTypes.func.isRequired,
  },

  _headerCellFormatter(header) {
    const className = (header === '操作' ? 'actions' : '');
    return <th className={className}>{header}</th>;
  },
  _roleInfoFormatter(role) {
    const actions = [
      <Button key="delete" bsSize="xsmall" bsStyle="primary" onClick={() => this.props.deleteRole(role)}
              title="删除角色">删除</Button>,
      <span key="space">&nbsp;</span>,
      <Button key="edit" bsSize="xsmall" bsStyle="info" onClick={() => this.props.showEditRole(role)}
              title="编辑角色">编辑</Button>,
    ];

    return (
      <tr key={role.name}>
        <td>{role.name}</td>
        <td className="limited">{role.description}</td>
        <td>
          {role.read_only ? null : actions}
        </td>
      </tr>
    );
  },
  render() {
    const filterKeys = ['name', 'description'];
    const headers = ['名称', '描述', '执行'];

    return (
      <div>
        <DataTable id="role-list"
                   className="table-hover"
                   headers={headers}
                   headerCellFormatter={this._headerCellFormatter}
                   sortByKey={'name'}
                   rows={this.props.roles.toJS()}
                   filterBy="Name"
                   dataRowFormatter={this._roleInfoFormatter}
                   filterLabel="筛选角色"
                   filterKeys={filterKeys} />
      </div>
    );
  },
});

export default RoleList;
