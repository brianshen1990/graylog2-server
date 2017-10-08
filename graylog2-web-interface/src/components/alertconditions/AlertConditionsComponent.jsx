import React from 'react';
import Reflux from 'reflux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import naturalSort from 'javascript-natural-sort';

import { Spinner } from 'components/common';
import { AlertConditionsList } from 'components/alertconditions';

import Routes from 'routing/Routes';

import CombinedProvider from 'injection/CombinedProvider';
const { StreamsStore } = CombinedProvider.get('Streams');
const { AlertConditionsStore, AlertConditionsActions } = CombinedProvider.get('AlertConditions');

const AlertConditionsComponent = React.createClass({
  mixins: [Reflux.connect(AlertConditionsStore)],

  getInitialState() {
    return {
      streams: undefined,
    };
  },

  componentDidMount() {
    this._loadData();
  },

  _loadData() {
    StreamsStore.listStreams().then((streams) => {
      this.setState({ streams: streams });
    });

    AlertConditionsActions.listAll();
  },

  _isLoading() {
    return !this.state.streams || !this.state.allAlertConditions;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const alertConditions = this.state.allAlertConditions.sort((a1, a2) => {
      const t1 = a1.title || '未命名';
      const t2 = a2.title || '未命名';
      return naturalSort(t1.toLowerCase(), t2.toLowerCase());
    });

    return (
      <div>
        <div className="pull-right">
          <LinkContainer to={Routes.ALERTS.NEW_CONDITION}>
            <Button bsStyle="success">创建新的告警</Button>
          </LinkContainer>
        </div>
        <h2>告警条件</h2>
        <p>这里是所有配置好的告警条件</p>
        <AlertConditionsList alertConditions={alertConditions} streams={this.state.streams} />
      </div>
    );
  },
});

export default AlertConditionsComponent;
