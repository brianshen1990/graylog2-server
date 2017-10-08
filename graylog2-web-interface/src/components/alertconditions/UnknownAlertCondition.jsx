import React from 'react';
import { Alert, Col, DropdownButton, MenuItem } from 'react-bootstrap';

import { EntityListItem } from 'components/common';

const UnknownAlertCondition = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object,
    onDelete: React.PropTypes.func.isRequired,
  },

  render() {
    const condition = this.props.alertCondition;
    const stream = this.props.stream;

    const actions = [
      <DropdownButton key="actions-button" title="操作" pullRight id={`more-actions-dropdown-${condition.id}`}>
        <MenuItem onSelect={this.props.onDelete}>删除</MenuItem>
      </DropdownButton>,
    ];

    const content = (
      <Col md={12}>
        <Alert bsStyle="warning">
          无法解析通知类别，通常是因为插件缺失造成。
        </Alert>
      </Col>
    );
    return (
      <EntityListItem key={`entry-list-${condition.id}`}
                      title="未知通知"
                      titleSuffix={`(${condition.type})`}
                      description={stream ? <span>正在查看数据流 <em>{stream.title}</em></span> : '未在查看数据流'}
                      actions={actions}
                      contentRow={content} />
    );
  },
});

export default UnknownAlertCondition;
