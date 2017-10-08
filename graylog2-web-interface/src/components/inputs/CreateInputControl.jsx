import React from 'react';
import Reflux from 'reflux';
import { Button, Row, Col } from 'react-bootstrap';

import { Select } from 'components/common';

import ActionsProvider from 'injection/ActionsProvider';
const InputTypesActions = ActionsProvider.getActions('InputTypes');
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const InputTypesStore = StoreProvider.getStore('InputTypes');

import { InputForm } from 'components/inputs';

const CreateInputControl = React.createClass({
  mixins: [Reflux.connect(InputTypesStore)],
  getInitialState() {
    return {
      selectedInput: undefined,
      selectedInputDefinition: undefined,
    };
  },
  _formatSelectOptions() {
    let options = [];

    if (this.state.inputTypes) {
      const inputTypesIds = Object.keys(this.state.inputTypes);
      options = inputTypesIds.map((id) => {
        return { value: id, label: this.state.inputTypes[id] };
      });
      options.sort((inputTypeA, inputTypeB) => inputTypeA.label.toLowerCase().localeCompare(inputTypeB.label.toLowerCase()));
    } else {
      options.push({ value: 'none', label: '没有可用输入', disabled: true });
    }

    return options;
  },
  _onInputSelect(selectedInput) {
    if (selectedInput === '') {
      this.setState(this.getInitialState());
    }

    this.setState({ selectedInput: selectedInput });
    InputTypesActions.get.triggerPromise(selectedInput).then(inputDefinition => this.setState({ selectedInputDefinition: inputDefinition }));
  },
  _openModal(event) {
    event.preventDefault();
    this.refs.configurationForm.open();
  },
  _createInput(data) {
    InputsActions.create(data).then(() => {
      this.setState(this.getInitialState());
    });
  },
  render() {
    let inputModal;
    if (this.state.selectedInputDefinition) {
      const inputTypeName = this.state.inputTypes[this.state.selectedInput];
      inputModal = (
        <InputForm ref="configurationForm"
                   key="configuration-form-input"
                   configFields={this.state.selectedInputDefinition.requested_configuration}
                   title={<span>开启新的<em>{inputTypeName}</em> 输入</span>}
                   helpBlock={'为你的输入选择一个名称'}
                   typeName={this.state.selectedInput}
                   submitAction={this._createInput} />
      );
    }
    return (
      <Row className="content input-new">
        <Col md={12}>
          <form className="form-inline" onSubmit={this._openModal}>
            <div className="form-group" style={{ width: 300 }}>
              <Select placeholder="选择输入" options={this._formatSelectOptions()} matchProp="label"
                      onValueChange={this._onInputSelect} value={this.state.selectedInput} />
            </div>
            &nbsp;
            <Button bsStyle="success" type="submit" disabled={!this.state.selectedInput}>设置新的输入</Button>
          </form>
          {inputModal}
        </Col>
      </Row>
    );
  },
});

export default CreateInputControl;
