import React from 'react';
import Reflux from 'reflux';
import { Button } from 'react-bootstrap';
import Promise from 'bluebird';

import CombinedProvider from 'injection/CombinedProvider';
const { AlertsStore, AlertsActions } = CombinedProvider.get('Alerts');
const { AlertConditionsStore, AlertConditionsActions } = CombinedProvider.get('AlertConditions');
const { StreamsStore } = CombinedProvider.get('Streams');

import { Alert } from 'components/alerts';
import { EntityList, PaginatedList, Spinner } from 'components/common';

const AlertsComponent = React.createClass({
  mixins: [Reflux.connect(AlertsStore), Reflux.connect(AlertConditionsStore)],

  getInitialState() {
    return {
      displayAllAlerts: false,
      loading: false,
    };
  },

  componentDidMount() {
    this.loadData(this.currentPage, this.pageSize);
  },

  currentPage: 1,
  pageSize: 10,

  loadData(pageNo, limit) {
    this.setState({ loading: true });
    const promises = [
      AlertsActions.listAllPaginated((pageNo - 1) * limit, limit, this.state.displayAllAlerts ? 'all' : 'unresolved'),
      AlertConditionsActions.listAll(),
      AlertConditionsActions.available(),
      StreamsStore.listStreams().then((streams) => {
        this.setState({ streams: streams });
      }),
    ];

    Promise.all(promises).finally(() => this.setState({ loading: false }));
  },

  _refreshData() {
    this.loadData(this.currentPage, this.pageSize);
  },

  _onToggleAllAlerts() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.setState({ displayAllAlerts: !this.state.displayAllAlerts }, () => this.loadData(this.currentPage, this.pageSize));
  },

  _onChangePaginatedList(page, size) {
    this.currentPage = page;
    this.pageSize = size;
    this.loadData(page, size);
  },

  _formatAlert(alert) {
    return (
      <Alert key={alert.id} alert={alert} alertConditions={this.state.allAlertConditions} streams={this.state.streams}
             conditionTypes={this.state.types} />
    );
  },

  _isLoading() {
    return !this.state.alerts || !this.state.allAlertConditions || !this.state.types || !this.state.streams;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    return (
      <div>
        <div className="pull-right">
          <Button bsStyle="info" onClick={this._refreshData} disabled={this.state.loading}>
            {this.state.loading ? '刷新中...' : '刷新'}
          </Button>
          &nbsp;
          <Button bsStyle="info" onClick={this._onToggleAllAlerts}>
            呈现 {this.state.displayAllAlerts ? '未解决' : '全部'} 告警
          </Button>
        </div>
        <h2>{this.state.displayAllAlerts ? '告警' : '未解决告警'}</h2>
        <p className="description">
          在此处检查您的告警状态。 当前显示了{' '}
          {this.state.displayAllAlerts ? '全部' : '未解决'} 告警。.
        </p>

        <PaginatedList totalItems={this.state.alerts.total} pageSize={this.pageSize} onChange={this._onChangePaginatedList}
                       showPageSizeSelect={false}>
          <EntityList bsNoItemsStyle={this.state.displayAllAlerts ? 'info' : 'success'}
                      noItemsText={this.state.displayAllAlerts ? '没有告警' : '好消息! 当前没有未解决的告警.'}
                      items={this.state.alerts.alerts.map(alert => this._formatAlert(alert))} />
        </PaginatedList>
      </div>
    );
  },
});

export default AlertsComponent;
