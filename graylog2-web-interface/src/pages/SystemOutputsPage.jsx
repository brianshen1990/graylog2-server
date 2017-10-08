import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import { DocumentTitle, PageHeader } from 'components/common';
import OutputsComponent from 'components/outputs/OutputsComponent';

const SystemOutputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="输出">
        <span>
          <PageHeader title="集群输出">
            <span>
              xxxx 日志平台 节点可以转发消息到输出。您可以随时开始或者结束任意的输出{' '}
              <strong>以指定它们实时转发消息。.</strong>
            </span>

          </PageHeader>

          <OutputsComponent permissions={this.state.currentUser.permissions} />
        </span>
      </DocumentTitle>
    );
  },
});

export default SystemOutputsPage;
