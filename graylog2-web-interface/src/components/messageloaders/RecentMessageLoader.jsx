import React, { PropTypes } from 'react';
import InputDropdown from 'components/inputs/InputDropdown';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const UniversalSearchStore = StoreProvider.getStore('UniversalSearch');

const RecentMessageLoader = React.createClass({
  propTypes: {
    inputs: PropTypes.object,
    onMessageLoaded: PropTypes.func.isRequired,
    selectedInputId: PropTypes.string,
  },
  getInitialState() {
    return {
      loading: false,
    };
  },

  onClick(inputId) {
    const input = this.props.inputs.get(inputId);
    if (!input) {
      UserNotification.error(`无效的输入: ${inputId}`,
        `无法从输入 ${inputId}导入信息`);
    }
    this.setState({ loading: true });
    const promise = UniversalSearchStore.search('relative', `gl2_source_input:${inputId} OR gl2_source_radio_input:${inputId}`,
      { range: 3600 }, undefined, 1, undefined, undefined, undefined, false);
    promise.then((response) => {
      if (response.total_results > 0) {
        this.props.onMessageLoaded(response.messages[0]);
      } else {
        UserNotification.error('I输入没有返回一条信息.');
        this.props.onMessageLoaded(undefined);
      }
    });
    promise.finally(() => this.setState({ loading: false }));
  },
  render() {
    let helpMessage;
    if (this.props.selectedInputId) {
      helpMessage = '点击 "导入信息" 导入一条最新的消息。.';
    } else {
      helpMessage = '从以下列表中选择输入， 点击 "导入信息" 导入一条最新的消息.';
    }
    return (
      <div style={{ marginTop: 5 }}>
        {helpMessage}
        <InputDropdown inputs={this.props.inputs} preselectedInputId={this.props.selectedInputId}
                       onLoadMessage={this.onClick} title={this.state.loading ? '导入消息中...' : '导入消息'}
                       disabled={this.state.loading} />
      </div>
    );
  },
});

export default RecentMessageLoader;
