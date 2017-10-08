import React from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import { DocumentTitle, PageHeader } from 'components/common';
import { NodesList } from 'components/nodes';

const NodesPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  render() {
    return (
      <DocumentTitle title="节点">
        <div>
          <PageHeader title="节点">
            <span>本页为你展现 xxxx 日志平台集群的节点信息。 </span>

            <span>
              你可以在任意时候停止消息处理程序。消息处理程的缓存不会再接收任何的消息，直到您恢复该程序。
              如果消息日志被打开，消息会被持久化到硬盘，即使消息处理程序被禁用。
            </span>
          </PageHeader>
          <NodesList permissions={this.state.currentUser.permissions} />
        </div>
      </DocumentTitle>
    );
  },
});

export default NodesPage;
