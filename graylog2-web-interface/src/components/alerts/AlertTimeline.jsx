import React from 'react';
import Reflux from 'reflux';
import moment from 'moment';

import { Spinner, Timestamp } from 'components/common';

import CombinedProvider from 'injection/CombinedProvider';
const { AlarmCallbackHistoryStore } = CombinedProvider.get('AlarmCallbackHistory');
const { AlertNotificationsStore } = CombinedProvider.get('AlertNotifications');

import style from './AlertTimeline.css';

const AlertTimeline = React.createClass({
  propTypes: {
    alert: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object.isRequired,
    condition: React.PropTypes.object,
    conditionType: React.PropTypes.object,
  },

  mixins: [Reflux.connect(AlertNotificationsStore), Reflux.connect(AlarmCallbackHistoryStore)],

  _isLoading() {
    return !this.state.histories || !this.state.availableNotifications;
  },

  _historiesTimeline(lastEventTime) {
    const formattedHistories = [];

    if (this.state.histories.length === 0) {
      return [
        <dt key="history-title"><Timestamp dateTime={lastEventTime} /></dt>,
        <dd key="history-desc">没有为该告警配置通知</dd>,
      ];
    }

    this.state.histories
      .sort((h1, h2) => {
        const h1Time = moment(h1.created_at);
        const h2Time = moment(h2.created_at);

        return (h1Time.isBefore(h2Time) ? -1 : h2Time.isBefore(h1Time) ? 1 : 0);
      })
      .forEach((history) => {
        const configuration = history.alarmcallbackconfiguration;
        const type = this.state.availableNotifications[configuration.type];
        let title;
        if (type) {
          title = <span><em>{configuration.title || '未命名'}</em> ({type.name})</span>;
        } else {
          title = <span><em>位置通知</em> <small>({configuration.type})</small></span>;
        }

        formattedHistories.push(
          <dt key={`${history.id}-title`}><Timestamp dateTime={history.created_at} /></dt>,
          (<dd key={`${history.id}-desc`}>
            Graylog {history.result.type === 'error' ? '无法发送' : '已发送'} {title} 通知
          </dd>),
        );
      });

    return formattedHistories;
  },

  _resolutionTimeline() {
    const formattedResolution = [];

    if (!this.props.alert.is_interval) {
      // Old alert without a resolution_at field
      formattedResolution.push(
        <dt key="resolution-title"><Timestamp dateTime={this.props.alert.triggered_at} /></dt>,
        <dd key="resolution-desc">告警不支持解决, 当再次被触发后会被标记为已解决.</dd>,
      );
    } else if (this.props.alert.resolved_at) {
      formattedResolution.push(
        <dt key="resolution-title"><Timestamp dateTime={this.props.alert.resolved_at} /></dt>,
        <dd key="resolution-desc">条件不再满足, 标记为已解决</dd>,
        );
    } else {
      const conditionParameters = this.props.alert.condition_parameters || {};
      const repeatNotifications = conditionParameters.repeat_notifications || false;
      const notificationsText = (repeatNotifications ?
          '条件被配置为重复通知, 当条件不满足时, 会再次发送通知' :
          '条件被配置为不重复通知');

      formattedResolution.push(
        <dt key="notifications-title"><Timestamp dateTime={new Date()} /></dt>,
        <dd key="notifications-desc">{notificationsText}</dd>,
        <dt key="resolution-title"><Timestamp dateTime={new Date()} /></dt>,
        <dd key="resolution-desc">条件仍然满足, <strong>告警未解决</strong></dd>,
        );
    }

    return formattedResolution;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const alert = this.props.alert;
    const conditionExists = this.props.condition && Object.keys(this.props.condition).length > 0;
    const condition = this.props.condition || {};
    const type = this.props.conditionType;
    const triggeredAtTimestamp = <Timestamp dateTime={alert.triggered_at} />;

    const title = (
      <span>
        <em>{conditionExists ? condition.title || '未命名条件' : '未知条件'}</em>{' '}
        ({type.name || condition.type || '未知条件类别'})
      </span>
    );

    return (
      <dl className={`dl-horizontal ${style.alertTimeline}`}>
        <dt>{triggeredAtTimestamp}</dt>
        <dd>系统会检查 {title} 条件, 在数据流 <em>{this.props.stream.title}</em>上</dd>
        <dt>{triggeredAtTimestamp}</dt>
        <dd>{alert.description}</dd>
        <dt>{triggeredAtTimestamp}</dt>
        <dd>系统会触发告警 {title} 并且开始发送通知.</dd>
        {this._historiesTimeline(alert.triggered_at)}
        {this._resolutionTimeline()}
      </dl>
    );
  },
});

export default AlertTimeline;
