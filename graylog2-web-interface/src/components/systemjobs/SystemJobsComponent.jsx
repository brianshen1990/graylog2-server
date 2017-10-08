import React from 'react';
import Reflux from 'reflux';
import { Col, Row } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const SystemJobsStore = StoreProvider.getStore('SystemJobs');

import ActionsProvider from 'injection/ActionsProvider';
const SystemJobsActions = ActionsProvider.getActions('SystemJobs');

import { Spinner } from 'components/common';
import { SystemJobsList } from 'components/systemjobs';

const SystemJobsComponent = React.createClass({
  mixins: [Reflux.connect(SystemJobsStore)],
  componentDidMount() {
    SystemJobsActions.list();

    this.interval = setInterval(SystemJobsActions.list, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    if (!this.state.jobs) {
      return <Spinner />;
    }
    const jobs = Object.keys(this.state.jobs)
      .map(nodeId => this.state.jobs[nodeId] ? this.state.jobs[nodeId].jobs : [])
      .reduce((a, b) => a.concat(b));
    return (
      <Row className="content">
        <Col md={12}>
          <h2>系统工作</h2>
          <p className="description">
            系统工作是指xxxx 日志平台需要维护时，需要长期运行的任务。 一些工作会提供进度信息并且被停止。
          </p>

          <SystemJobsList jobs={jobs} />
        </Col>
      </Row>
    );
  },
});

export default SystemJobsComponent;
