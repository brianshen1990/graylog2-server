import React, { PropTypes } from 'react';

import { BootstrapModalForm, Input } from 'components/bootstrap';

import StoreProvider from 'injection/StoreProvider';
const InputStaticFieldsStore = StoreProvider.getStore('InputStaticFields');

const StaticFieldForm = React.createClass({
  propTypes: {
    input: PropTypes.object.isRequired,
  },
  open() {
    this.refs.modal.open();
  },
  _addStaticField() {
    const fieldName = this.refs.fieldName.getValue();
    const fieldValue = this.refs.fieldValue.getValue();

    InputStaticFieldsStore.create(this.props.input, fieldName, fieldValue).then(() => this.refs.modal.close());
  },
  render() {
    return (
      <BootstrapModalForm ref="modal" title="添加静态字段" submitButtonText="添加字段"
                          onSubmitForm={this._addStaticField}>
        <p>定义静态字段, 在每一个输入消息中都会加上它. 如说输入消息中已有该字段,
          则不会覆盖. 请确保只能使用阿拉伯数字和字符以及下划线.</p>
        <Input ref="fieldName" type="text" id="field-name" label="字段名称" className="validatable"
               data-validate="alphanum_underscore" required autoFocus />
        <Input ref="fieldValue" type="text" id="field-value" label="字段值" required />
      </BootstrapModalForm>
    );
  },
});

export default StaticFieldForm;
