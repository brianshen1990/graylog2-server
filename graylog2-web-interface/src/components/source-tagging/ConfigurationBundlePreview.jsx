import React from 'react';
import { Button } from 'react-bootstrap';
import { markdown } from 'markdown';

import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const ConfigurationBundlesActions = ActionsProvider.getActions('ConfigurationBundles');

const ConfigurationBundlePreview = React.createClass({
  propTypes: {
    sourceTypeId: React.PropTypes.string,
    sourceTypeDescription: React.PropTypes.string,
    onDelete: React.PropTypes.func.isRequired,
  },

  _confirmDeletion() {
    if (window.confirm('即将删除内容包，确定?')) {
      ConfigurationBundlesActions.delete(this.props.sourceTypeId).then(() => {
        UserNotification.success('绑定删除成功.', '成功');
        this.props.onDelete();
      }, () => {
        UserNotification.error('删除绑定失败.', '错误');
      });
    }
  },
  _onApply() {
    ConfigurationBundlesActions.apply(this.props.sourceTypeId).then(() => {
      UserNotification.success('绑定应用成功.', '成功');
    }, () => {
      UserNotification.error('绑定应用失败.', '错误');
    });
  },
  render() {
    let preview = '选择一个内容包进行预览。';
    let applyAction = '';
    let deleteAction = '';

    if (this.props.sourceTypeDescription) {
      preview = this.props.sourceTypeDescription;
      applyAction = <Button bsStyle="success" onClick={this._onApply}>Apply content</Button>;
      deleteAction = <Button className="pull-right" bsStyle="warning" bsSize="xsmall" onClick={this._confirmDeletion}>移除内容包</Button>;
    }

    const markdownPreview = markdown.toHTML(preview);

    return (
      <div className="bundle-preview">
        <div style={{ marginBottom: 5 }}>
          {deleteAction}
          <h2>内容包描述:</h2>
        </div>
        <div dangerouslySetInnerHTML={{ __html: markdownPreview }} />
        <div className="preview-actions">
          {applyAction}
        </div>
      </div>
    );
  },
});

export default ConfigurationBundlePreview;
