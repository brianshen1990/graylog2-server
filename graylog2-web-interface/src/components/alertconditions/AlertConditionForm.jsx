import React from 'react';
import Reflux from 'reflux';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import { ConfigurationForm } from 'components/configurationforms';

import CombinedProvider from 'injection/CombinedProvider';
const { AlertConditionsStore } = CombinedProvider.get('AlertConditions');

const AlertConditionForm = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired,
  },
  mixins: [Reflux.connect(AlertConditionsStore)],

  getDefaultProps() {
    return {
      onCancel: () => {
      },
      onSubmit: () => {
      },
    };
  },

  getValue() {
    const values = this.refs.configurationForm.getValue();
    return {
      title: values.title,
      type: this.props.type,
      parameters: values.configuration,
    };
  },
  open() {
    this.refs.configurationForm.open();
  },
  _onCancel() {
    this.props.onCancel();
  },
  _onSubmit() {
    const request = this.getValue();
    this.props.onSubmit(request);
  },
  _formatTitle(alertCondition, name) {
    const action = alertCondition ? '更新' : '创建';
    const conditionName = alertCondition ? <em>{alertCondition.title || '未命名'}</em> : name;
    return <span>{action} {conditionName}</span>;
  },

  render() {
    const type = this.props.type;
    const alertCondition = this.props.alertCondition;
    const typeDefinition = this.state.types[type];

    return (
      <ConfigurationForm ref="configurationForm"
                         key="configuration-form-alert-condition"
                         configFields={typeDefinition.requested_configuration}
                         title={this._formatTitle(alertCondition, typeDefinition.name)}
                         typeName={type}
                         submitAction={this._onSubmit}
                         cancelAction={this._onCancel}
                         titleValue={alertCondition ? alertCondition.title : ''}
                         helpBlock="告警条件标题"
                         values={alertCondition ? alertCondition.parameters : {}}>
        <FormGroup>
          <ControlLabel>{`${typeDefinition.name} 描述`}</ControlLabel>
          <FormControl.Static>{typeDefinition.human_name}</FormControl.Static>
        </FormGroup>
      </ConfigurationForm>
    );
  },
});

export default AlertConditionForm;
