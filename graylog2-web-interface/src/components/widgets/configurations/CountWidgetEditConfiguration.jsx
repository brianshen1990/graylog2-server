import React, { PropTypes } from 'react';
import { Input } from 'components/bootstrap';

import { QueryConfiguration } from 'components/widgets/configurations';

const CountWidgetEditConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    showQueryConfig: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      showQueryConfig: true,
    };
  },
  render() {
    return (
      <fieldset>
        {this.props.showQueryConfig && <QueryConfiguration {...this.props} />}
        <Input key="trend"
               type="checkbox"
               id="count-trend"
               name="trend"
               label="显示趋势"
               defaultChecked={this.props.config.trend}
               onChange={this.props.onChange}
               help="用数字显示趋势信息" />

        <Input key="lowerIsBetter"
               type="checkbox"
               id="count-lower-is-better"
               name="lower_is_better"
               label="越低越好"
               disabled={this.props.config.trend === false}
               defaultChecked={this.props.config.lower_is_better}
               onChange={this.props.onChange}
               help="当趋势减小时，使用绿色表示." />
      </fieldset>
    );
  },
});

export default CountWidgetEditConfiguration;
