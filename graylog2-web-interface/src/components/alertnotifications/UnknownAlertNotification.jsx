import React from 'react';
import { Alert, Col, DropdownButton, MenuItem } from 'react-bootstrap';

import { EntityListItem } from 'components/common';

const UnknownAlertNotification = React.createClass({
  propTypes: {
    alertNotification: React.PropTypes.object.isRequired,
    onDelete: React.PropTypes.func.isRequired,
  },

  render() {
    const notification = this.props.alertNotification;

    const actions = [
      <DropdownButton key="actions-button" title="操作" pullRight id={`more-actions-dropdown-${notification.id}`}>
        <MenuItem onSelect={this.props.onDelete}>删除</MenuItem>
      </DropdownButton>,
    ];

    const content = (
      <Col md={12}>
        <Alert bsStyle="warning">
          无法解析出通知类别。通常是插件丢失造成。
        </Alert>
      </Col>
    );
    return (
      <EntityListItem key={`entry-list-${notification.id}`}
                      title="未知通知"
                      titleSuffix={`(${notification.type})`}
                      description="通知类别未知，无法执行。"
                      actions={actions}
                      contentRow={content} />
    );
  },
});

export default UnknownAlertNotification;
