import React from 'react';
import Reflux from 'reflux';
import naturalSort from 'javascript-natural-sort';
import { Button, Col, Row } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import { Select, Spinner } from 'components/common';
import { AlertConditionForm } from 'components/alertconditions';
import Routes from 'routing/Routes';
import UserNotification from 'util/UserNotification';
import history from 'util/History';

import CombinedProvider from 'injection/CombinedProvider';
const { AlertConditionsStore, AlertConditionsActions } = CombinedProvider.get('AlertConditions');
const { StreamsStore } = CombinedProvider.get('Streams');

const CreateAlertConditionInput = React.createClass({
  mixins: [Reflux.connect(AlertConditionsStore)],
  getInitialState() {
    return {
      streams: undefined,
      selectedStream: undefined,
      type: this.PLACEHOLDER,
    };
  },

  componentDidMount() {
    StreamsStore.listStreams().then((streams) => {
      this.setState({ streams: streams });
    });
  },

  PLACEHOLDER: 'placeholder',

  _onChange(evt) {
    this.setState({ type: evt.target.value });
  },

  _onStreamChange(nextStream) {
    this.setState({ selectedStream: this.state.streams.find(s => s.id === nextStream) });
  },

  _onSubmit(data) {
    if (!this.state.selectedStream) {
      UserNotification.error('请选择该告警条件需要检查的数据流.', '无法保存告警条件');
    }

    AlertConditionsActions.save(this.state.selectedStream.id, data).then((conditionId) => {
      history.pushState(null, Routes.show_alert_condition(this.state.selectedStream.id, conditionId));
    });
  },
  _openForm() {
    this.refs.configurationForm.open();
  },
  _resetForm() {
    this.setState({ type: this.PLACEHOLDER });
  },
  _formatConditionForm(type) {
    return (
      <AlertConditionForm ref="configurationForm" onCancel={this._resetForm} onSubmit={this._onSubmit} type={type} />
    );
  },

  _formatOption(key, value) {
    return { value: value, label: key };
  },

  _isLoading() {
    return !this.state.types || !this.state.streams;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const conditionForm = (this.state.type !== this.PLACEHOLDER ? this._formatConditionForm(this.state.type) : null);
    const availableTypes = Object.keys(this.state.types).map((value) => {
      return <option key={`type-option-${value}`} value={value}>{this.state.types[value].name}</option>;
    });
    const formattedStreams = this.state.streams
      .map(stream => this._formatOption(stream.title, stream.id))
      .sort((s1, s2) => naturalSort(s1.label.toLowerCase(), s2.label.toLowerCase()));
    return (
      <div>
        <h2>告警条件</h2>
        <p className="description">定义将要触发告警的条件。</p>

        <Row>
          <Col md={6}>
            <form>
              <Input label="数据流告警" help="选择数据流">
                <Select placeholder="选择数据流" options={formattedStreams} onValueChange={this._onStreamChange} />
              </Input>

              <Input type="select" value={this.state.type} onChange={this._onChange}
                     disabled={!this.state.selectedStream}
                     label="条件类别" help="选择条件类别">
                <option value={this.PLACEHOLDER} disabled>选择条件类别</option>
                {availableTypes}
              </Input>
              {conditionForm}
              {' '}
              <Button onClick={this._openForm} disabled={this.state.type === this.PLACEHOLDER} bsStyle="success">
                添加告警条件
              </Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  },
});

export default CreateAlertConditionInput;
