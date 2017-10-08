import React from 'react';

import { DocumentTitle, PageHeader } from 'components/common';
import { LoggerOverview } from 'components/loggers';

const LoggersPage = React.createClass({
  render() {
    return (
      <DocumentTitle title="系统日志">
        <span>
          <PageHeader title="系统日志">
            <span>
              此处可以控制 xxxx 日志平台的系统日志。您可以更改日志等级。请注意，当对应服务重启后，恢复默认设置。
            </span>
          </PageHeader>
          <LoggerOverview />
        </span>
      </DocumentTitle>
    );
  },
});

export default LoggersPage;
