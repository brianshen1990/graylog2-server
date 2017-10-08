import React from 'react';
import Reflux from 'reflux';
import moment from 'moment';
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import { Pluralize } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const RefreshStore = StoreProvider.getStore('Refresh');

import ActionsProvider from 'injection/ActionsProvider';
const RefreshActions = ActionsProvider.getActions('Refresh');

const RefreshControls = React.createClass({
  mixins: [Reflux.connect(RefreshStore, 'refresh')],
  INTERVAL_OPTIONS: {
    '1 Second': 1,
    '2 Seconds': 2,
    '5 Seconds': 5,
    '10 Seconds': 10,
    '30 Seconds': 30,
    '1 Minute': 60,
    '5 Minutes': 300,
  },
  INTERVAL_OPTIONS_MAPPING: {
    '1 Second': "1 秒",
    '2 Seconds': "2 秒",
    '5 Seconds': "5 秒",
    '10 Seconds': "10 秒",
    '30 Seconds': "30 秒",
    '1 Minute': "60 秒",
    '5 Minutes': "300 秒",
  },
  _changeInterval(interval) {
    RefreshActions.changeInterval(interval);
    RefreshActions.enable();
  },
  render() {
    const intervalOptions = Object.keys(this.INTERVAL_OPTIONS).map((key) => {
      const interval = this.INTERVAL_OPTIONS[key] * 1000;
      return <MenuItem key={`RefreshControls-${key}`} onClick={() => this._changeInterval(interval)}>{this.INTERVAL_OPTIONS_MAPPING[key] || key}</MenuItem>;
    });
    const intervalDuration = moment.duration(this.state.refresh.interval);
    const naturalInterval = intervalDuration.asSeconds() < 60 ?
      <span>{intervalDuration.asSeconds()} <Pluralize singular="秒" plural="秒" value={intervalDuration.asSeconds()} /></span> :
      <span>{intervalDuration.asMinutes()} <Pluralize singular="分钟" plural="分钟" value={intervalDuration.asMinutes()} /></span>;
    const buttonLabel = <span>每 {naturalInterval} 更新</span>;
    return (
      <ButtonGroup>
        <Button bsSize="small" onClick={() => this.state.refresh.enabled ? RefreshActions.disable() : RefreshActions.enable()}>
          {this.state.refresh.enabled ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
        </Button>

        <DropdownButton bsSize="small" title={this.state.refresh.enabled ? buttonLabel : '未实时更新'} id="refresh-options-dropdown">
          {intervalOptions}
        </DropdownButton>
      </ButtonGroup>
    );
  },
});

export default RefreshControls;
