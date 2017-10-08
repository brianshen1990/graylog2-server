import React, { PropTypes } from 'react';

import { Input } from 'components/bootstrap';

const CSVFileAdapterFieldSet = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
// eslint-disable-next-line react/no-unused-prop-types
    updateConfig: PropTypes.func.isRequired,
    handleFormEvent: PropTypes.func.isRequired,
    validationState: PropTypes.func.isRequired,
    validationMessage: PropTypes.func.isRequired,
  },

  render() {
    const config = this.props.config;

    return (<fieldset>
      <Input type="text"
             id="path"
             name="path"
             label="文件路径"
             autoFocus
             required
             onChange={this.props.handleFormEvent}
             help={this.props.validationMessage('path', 'CSV 文件路径。')}
             bsStyle={this.props.validationState('path')}
             value={config.path}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="number"
             id="check_interval"
             name="check_interval"
             label="查询间隔"
             required
             onChange={this.props.handleFormEvent}
             help="更新CSV文件的间隔周期(s为单位)。"
             value={config.check_interval}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="text"
             id="separator"
             name="separator"
             label="分隔符号"
             required
             onChange={this.props.handleFormEvent}
             help="分割符号会被用来作为分割标志。"
             value={config.separator}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="text"
             id="quotechar"
             name="quotechar"
             label="引用符号"
             required
             onChange={this.props.handleFormEvent}
             help="引用符号会被用来引用元素。"
             value={config.quotechar}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="text"
             id="key_column"
             name="key_column"
             label="列关键字"
             required
             onChange={this.props.handleFormEvent}
             help="查找表的关键字。"
             value={config.key_column}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="text"
             id="value_column"
             name="value_column"
             label="列值"
             required
             onChange={this.props.handleFormEvent}
             help="查找表中关键字对应的值。"
             value={config.value_column}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <Input type="checkbox"
             id="case_insensitive_lookup"
             name="case_insensitive_lookup"
             label="允许大小写查找。"
             checked={config.case_insensitive_lookup}
             onChange={this.props.handleFormEvent}
             help="如果忽略大小写，请开启。"
             wrapperClassName="col-md-offset-3 col-md-9" />
    </fieldset>);
  },
});

export default CSVFileAdapterFieldSet;
