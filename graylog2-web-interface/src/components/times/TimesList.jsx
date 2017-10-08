import React from 'react';
import Reflux from 'reflux';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import DateTime from 'logic/datetimes/DateTime';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const SystemStore = StoreProvider.getStore('System');

import { Spinner, Timestamp } from 'components/common';

const TimesList = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(SystemStore)],
  getInitialState() {
    return { time: moment() };
  },
  componentDidMount() {
    this.interval = setInterval(() => this.setState(this.getInitialState()), 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    if (!this.state.system) {
      return <Spinner />;
    }
    const time = this.state.time;
    const timeFormat = DateTime.Formats.DATETIME_TZ;
    const currentUser = this.state.currentUser;
    const serverTimezone = this.state.system.timezone;
    return (
      <Row className="content">
        <Col md={12}>
          <h2>时间配置</h2>

          <p className="description">
            时间区域可能会被混淆， 在此，你可以浏览系统中不同的组件的时间区域。
          </p>

          <dl className="system-dl">
            <dt>用户时间 <em>{currentUser.username}</em>:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} /></dd>
            <dt>浏览器时间:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz={'browser'} /></dd>
            <dt>xxxx 日志平台 系统时间:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz={serverTimezone} /></dd>
          </dl>
        </Col>
      </Row>
    );
  },
});

export default TimesList;
