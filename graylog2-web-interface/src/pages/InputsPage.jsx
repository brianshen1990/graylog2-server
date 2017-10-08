import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const InputStatesStore = StoreProvider.getStore('InputStates');

import { DocumentTitle, PageHeader } from 'components/common';
import { InputsList } from 'components/inputs';

const InputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  componentDidMount() {
    this.interval = setInterval(InputStatesStore.list, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    return (
      <DocumentTitle title="输入">
        <div>
          <PageHeader title="输入">
            <span>xxxx 日志平台通过 输入 接收数据。 开始或者结束任意的输入。</span>
          </PageHeader>
          <InputsList permissions={this.state.currentUser.permissions} />
        </div>
      </DocumentTitle>
    );
  },
});

export default InputsPage;
