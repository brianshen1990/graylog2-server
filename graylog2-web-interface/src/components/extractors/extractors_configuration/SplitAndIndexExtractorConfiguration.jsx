import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

import UserNotification from 'util/UserNotification';
import ExtractorUtils from 'util/ExtractorUtils';
import FormUtils from 'util/FormsUtils';

const SplitAndIndexExtractorConfiguration = React.createClass({
  propTypes: {
    configuration: PropTypes.object.isRequired,
    exampleMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onExtractorPreviewLoad: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      trying: false,
      configuration: this._getEffectiveConfiguration(this.props.configuration),
    };
  },
  componentDidMount() {
    this.props.onChange(this.state.configuration);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ configuration: this._getEffectiveConfiguration(nextProps.configuration) });
  },
  DEFAULT_CONFIGURATION: { index: 1 },
  _getEffectiveConfiguration(configuration) {
    return ExtractorUtils.getEffectiveConfiguration(this.DEFAULT_CONFIGURATION, configuration);
  },
  _onChange(key) {
    return (event) => {
      this.props.onExtractorPreviewLoad(undefined);
      const newConfig = this.state.configuration;
      newConfig[key] = FormUtils.getValueFromInput(event.target);
      this.props.onChange(newConfig);
    };
  },
  _onTryClick() {
    this.setState({ trying: true });

    const promise = ToolsStore.testSplitAndIndex(this.state.configuration.split_by, this.state.configuration.index,
      this.props.exampleMessage);

    promise.then((result) => {
      if (!result.successful) {
        UserNotification.warning('我们无法运行分割和位置提取器。请检查您的参数.');
        return;
      }

      const preview = (result.cut ? <samp>{result.cut}</samp> : '');
      this.props.onExtractorPreviewLoad(preview);
    });

    promise.finally(() => this.setState({ trying: false }));
  },
  _isTryButtonDisabled() {
    const configuration = this.state.configuration;
    return this.state.trying || configuration.split_by === '' || configuration.index === undefined || configuration.index < 1 || !this.props.exampleMessage;
  },
  render() {
    const splitByHelpMessage = (
      <span>
        以什么字符来分割. <strong>示例:</strong> 空格符号{' '}
        <em>foo bar baz</em> 转换到 <em>[foo,bar,baz]</em>.
      </span>
    );

    const indexHelpMessage = (
      <span>
        哪一部分数据你需要使用? <strong>示例:</strong> <em>2</em> 选择 <em>bar</em>{' '}
        在 <em>foo bar baz</em> 当应用分割符号.
      </span>
    );

    return (
      <div>
        <Input type="text"
               id="split_by"
               label="分割符"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               defaultValue={this.state.configuration.split_by}
               onChange={this._onChange('split_by')}
               required
               help={splitByHelpMessage} />

        <Input type="number"
               id="index"
               label="目标位置"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               defaultValue={this.state.configuration.index}
               onChange={this._onChange('index')}
               min="1"
               required
               help={indexHelpMessage} />

        <Input wrapperClassName="col-md-offset-2 col-md-10">
          <Button bsStyle="info" onClick={this._onTryClick} disabled={this._isTryButtonDisabled()}>
            {this.state.trying ? <i className="fa fa-spin fa-spinner" /> : '试一试'}
          </Button>
        </Input>
      </div>
    );
  },
});

export default SplitAndIndexExtractorConfiguration;
