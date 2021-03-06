import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { Input } from 'components/bootstrap';
import ObjectUtils from 'util/ObjectUtils';
import FormsUtils from 'util/FormsUtils';
import { JSONValueInput } from 'components/common';

import { CachesContainer, CachePicker, DataAdaptersContainer, DataAdapterPicker } from 'components/lookup-tables';

import CombinedProvider from 'injection/CombinedProvider';

const { LookupTablesActions } = CombinedProvider.get('LookupTables');

const LookupTableForm = React.createClass({
  propTypes: {
    saved: PropTypes.func.isRequired,
    create: PropTypes.bool,
    table: PropTypes.object,
    validate: PropTypes.func,
    validationErrors: PropTypes.object,
  },

  getDefaultProps() {
    return {
      create: true,
      table: {
        id: undefined,
        title: '',
        description: '',
        name: '',
        cache_id: undefined,
        data_adapter_id: undefined,
        default_single_value: '',
        default_single_value_type: 'NULL',
        default_multi_value: '',
        default_multi_value_type: 'NULL',
      },
      validate: null,
      validationErrors: {},
    };
  },

  getInitialState() {
    return this._initialState(this.props.table);
  },

  componentDidMount() {
    if (!this.props.create) {
      // Validate when mounted to immediately show errors for invalid objects
      this._validate(this.props.table);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.table, nextProps.table)) {
      // props haven't change, don't update our state from them
      return;
    }
    this.setState(this._initialState(nextProps.table));
  },

  componentWillUnmount() {
    this._clearTimer();
  },

  validationCheckTimer: undefined,

  _clearTimer() {
    if (this.validationCheckTimer !== undefined) {
      clearTimeout(this.validationCheckTimer);
      this.validationCheckTimer = undefined;
    }
  },

  _validate(table) {
    if (!table.cache_id || !table.data_adapter_id) {
      return;
    }
    // first cancel outstanding validation timer, we have new data
    this._clearTimer();
    if (this.props.validate) {
      this.validationCheckTimer = setTimeout(() => this.props.validate(table), 500);
    }
  },

  _initialState(t) {
    const table = ObjectUtils.clone(t);

    return {
      table: {
        id: table.id,
        title: table.title,
        description: table.description,
        name: table.name,
        cache_id: table.cache_id,
        data_adapter_id: table.data_adapter_id,
        default_single_value: table.default_single_value,
        default_single_value_type: table.default_single_value_type,
        default_multi_value: table.default_multi_value,
        default_multi_value_type: table.default_multi_value_type,
      },
      enable_default_single: table.default_single_value_type && table.default_single_value_type !== 'NULL',
      enable_default_multi: table.default_multi_value_type && table.default_multi_value_type !== 'NULL',
    };
  },

  _onChange(event) {
    const table = ObjectUtils.clone(this.state.table);
    table[event.target.name] = FormsUtils.getValueFromInput(event.target);
    this._validate(table);
    this.setState({ table: table });
  },

  _onConfigChange(event) {
    const table = ObjectUtils.clone(this.state.table);
    table.config[event.target.name] = FormsUtils.getValueFromInput(event.target);
    this._validate(table);
    this.setState({ table: table });
  },

  _save(event) {
    if (event) {
      event.preventDefault();
    }

    let promise;
    if (this.props.create) {
      promise = LookupTablesActions.create(this.state.table);
    } else {
      promise = LookupTablesActions.update(this.state.table);
    }

    promise.then(() => {
      this.props.saved();
    });
  },

  _onAdapterSelect(id) {
    const table = ObjectUtils.clone(this.state.table);
    table.data_adapter_id = id;
    this._validate(table);
    this.setState({ table: table });
  },

  _onCacheSelect(id) {
    const table = ObjectUtils.clone(this.state.table);
    table.cache_id = id;
    this._validate(table);
    this.setState({ table: table });
  },

  _onDefaultValueUpdate(name, value, valueType) {
    const table = ObjectUtils.clone(this.state.table);

    table[`default_${name}_value`] = value;
    table[`default_${name}_value_type`] = valueType;

    this._validate(table);
    this.setState({ table: table });
  },

  _onCheckEnableSingleDefault(e) {
    const value = FormsUtils.getValueFromInput(e.target);
    this.setState({ enable_default_single: value });

    if (value === false) {
      this._onDefaultValueUpdate('single', '', 'NULL');
    }
  },

  _onCheckEnableMultiDefault(e) {
    const value = FormsUtils.getValueFromInput(e.target);
    this.setState({ enable_default_multi: value });

    if (value === false) {
      this._onDefaultValueUpdate('multi', '', 'NULL');
    }
  },

  _onDefaultSingleValueUpdate(value, valueType) {
    this._onDefaultValueUpdate('single', value, valueType);
  },

  _onDefaultMultiValueUpdate(value, valueType) {
    this._onDefaultValueUpdate('multi', value, valueType);
  },

  _validationState(fieldName) {
    if (this.props.validationErrors[fieldName]) {
      return 'error';
    }
    return null;
  },

  _validationMessage(fieldName, defaultText) {
    if (this.props.validationErrors[fieldName]) {
      return (<div>
        <span>{defaultText}</span>
        &nbsp;
        <span><b>{this.props.validationErrors[fieldName][0]}</b></span>
      </div>);
    }
    return <span>{defaultText}</span>;
  },

  render() {
    const table = this.state.table;

    return (
      <form className="form form-horizontal" onSubmit={this._save}>
        <fieldset>
          <Input type="text"
                 id="title"
                 name="title"
                 label="标题"
                 autoFocus
                 required
                 onChange={this._onChange}
                 help="为查找表定制简短的标题"
                 value={table.title}
                 labelClassName="col-sm-3"
                 wrapperClassName="col-sm-9" />

          <Input type="text"
                 id="description"
                 name="description"
                 label="描述"
                 onChange={this._onChange}
                 help="该查找表的描述"
                 value={table.description}
                 labelClassName="col-sm-3"
                 wrapperClassName="col-sm-9" />

          <Input type="text"
                 id="name"
                 name="name"
                 label="名称"
                 required
                 onChange={this._onChange}
                 help={this._validationMessage('name', '请确保名称的唯一性。.')}
                 bsStyle={this._validationState('name')}
                 value={table.name}
                 labelClassName="col-sm-3"
                 wrapperClassName="col-sm-9" />

          <Input type="checkbox"
                 label="开启单个默认值"
                 checked={this.state.enable_default_single}
                 onChange={this._onCheckEnableSingleDefault}
                 help="如果查找表需要提供一个默认值，请开启。"
                 wrapperClassName="col-md-offset-3 col-md-9"
                 />

          {this.state.enable_default_single &&
          <JSONValueInput label="单个默认值"
                          help={this._validationMessage('default_single_value', '单个默认值会在数据转接器或者缓存失效的情况下被使用。')}
                          validationState={this._validationState('default_single_value')}
                          update={this._onDefaultSingleValueUpdate}
                          required
                          value={table.default_single_value}
                          valueType={table.default_single_value_type || 'NULL'}
                          allowedTypes={['STRING', 'NUMBER', 'BOOLEAN', 'NULL']}
                          labelClassName="col-sm-3"
                          wrapperClassName="col-sm-9" />
          }

          <Input type="checkbox"
                 label="开启多个默认值"
                 checked={this.state.enable_default_multi}
                 onChange={this._onCheckEnableMultiDefault}
                 help="如果查找表需要提供多个默认值，请开启。"
                 wrapperClassName="col-md-offset-3 col-md-9" />

          {this.state.enable_default_multi &&
          <JSONValueInput label="Default multi value"
                          help={this._validationMessage('default_multi_value', '多个默认值会在数据转接器或者缓存失效的情况下被使用。')}
                          validationState={this._validationState('default_multi_value')}
                          update={this._onDefaultMultiValueUpdate}
                          value={table.default_multi_value}
                          valueType={table.default_multi_value_type || 'NULL'}
                          allowedTypes={['OBJECT', 'NULL']}
                          labelClassName="col-sm-3"
                          wrapperClassName="col-sm-9" />
          }
        </fieldset>

        <DataAdaptersContainer>
          <DataAdapterPicker onSelect={this._onAdapterSelect} selectedId={this.state.table.data_adapter_id} />
        </DataAdaptersContainer>

        <CachesContainer>
          <CachePicker onSelect={this._onCacheSelect} selectedId={this.state.table.cache_id} />
        </CachesContainer>

        <fieldset>
          <Input wrapperClassName="col-sm-offset-3 col-sm-9">
            <Button type="submit" bsStyle="success">{this.props.create ? '创建查找表' : '更新查找表'}</Button>
          </Input>
        </fieldset>
      </form>
    );
  },
});

export default LookupTableForm;
