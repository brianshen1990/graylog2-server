import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { PaginatedList, Spinner, Timestamp } from 'components/common';

import CombinedProvider from 'injection/CombinedProvider';
const { UniversalSearchStore } = CombinedProvider.get('UniversalSearch');

import Routes from 'routing/Routes';
import DateTime from 'logic/datetimes/DateTime';
import UserNotification from 'util/UserNotification';

const AlertMessages = React.createClass({
  propTypes: {
    alert: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      messages: undefined,
      totalMessages: 0,
    };
  },

  componentDidMount() {
    this._loadData();
  },

  PAGE_SIZE: 20,

  _getFrom() {
    const momentFrom = DateTime.parseFromString(this.props.alert.triggered_at).toMoment();
    return momentFrom.subtract(1, 'minute').toISOString();
  },

  _getTo() {
    const alert = this.props.alert;
    let momentTo;
    if (alert.is_interval) {
      momentTo = (alert.resolved_at ? DateTime.parseFromString(alert.resolved_at).toMoment().add(1, 'minute') : DateTime.now());
    } else {
      momentTo = DateTime.parseFromString(alert.triggered_at).toMoment().add(1, 'minute');
    }
    return momentTo.toISOString();
  },

  _loadData(page) {
    const searchParams = {
      from: this._getFrom(),
      to: this._getTo(),
    };
    const promise = UniversalSearchStore.search('absolute', '*', searchParams, this.props.stream.id, this.PAGE_SIZE,
      page || 1, 'timestamp', 'asc', undefined, false);
    promise.then(
      (response) => {
        if (response.total_results > 0) {
          this.setState({ messages: response.messages, totalMessages: response.total_results });
        } else {
          this.setState({ messages: [], totalMessages: 0 });
        }
      },
      (error) => {
        UserNotification.error(`告警获取消息失败: ${error}`,
          '无法获取告警消息');
      },
    );
  },

  _isLoading() {
    return !this.state.messages;
  },

  _onPageChange(page) {
    this._loadData(page);
  },

  _formatMessages(messages) {
    return messages
      .map((message) => {
        return (
          <tr key={`${message.index}-${message.id}`}>
            <td><Timestamp dateTime={message.formatted_fields.timestamp} /></td>
            <td>{message.formatted_fields.message}</td>
          </tr>
        );
      });
  },

  _formatAlertTimeRange() {
    return (
      <span>
        (
        <Timestamp dateTime={this._getFrom()} format={DateTime.Formats.DATETIME} />&nbsp;&#8211;&nbsp;
        <Timestamp dateTime={this._getTo()} format={DateTime.Formats.DATETIME} />
        )
      </span>
    );
  },

  render() {
    const timeRange = {
      rangetype: 'absolute',
      from: this._getFrom(),
      to: this._getTo(),
    };

    const title = (
      <div>
        <div className="pull-right">
          <LinkContainer to={Routes.stream_search(this.props.stream.id, '*', timeRange)}>
            <Button bsStyle="info">打开搜索页面</Button>
          </LinkContainer>
        </div>
        <h2>消息评估</h2>
        <p>
          可查看在告警周围的评估消息 {this._formatAlertTimeRange()}, 在数据流{' '}
          <em>{this.props.stream.title}</em>中.
        </p>
      </div>
    );

    if (this._isLoading()) {
      return (
        <div>
          {title}
          <Spinner />
        </div>
      );
    }

    const messages = this.state.messages;

    if (messages.length === 0) {
      return (
        <div>
          {title}
          <Alert bsStyle="info">在告警期间, 没有搜索结果.</Alert>
        </div>
      );
    }

    return (
      <div>
        {title}
        <PaginatedList pageSize={this.PAGE_SIZE} onChange={this._onPageChange} totalItems={this.state.totalMessages}
                       showPageSizeSelect={false}>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-condensed">
              <thead>
                <tr>
                  <th>时间戳</th>
                  <th>消息</th>
                </tr>
              </thead>
              <tbody>
                {this._formatMessages(messages)}
              </tbody>
            </table>
          </div>
        </PaginatedList>
      </div>
    );
  },
});

export default AlertMessages;
