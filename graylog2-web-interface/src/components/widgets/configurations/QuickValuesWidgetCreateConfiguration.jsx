import React, { PropTypes } from 'react';
import { Input } from 'components/bootstrap';

const QuickValuesWidgetCreateConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getInitialConfiguration() {
    return {
      show_pie_chart: true,
      show_data_table: true,
    };
  },

  render() {
    return (
      <fieldset>
        <Input key="showPieChart"
               type="checkbox"
               id="quickvalues-show-pie-chart"
               name="show_pie_chart"
               label="显示饼图"
               checked={this.props.config.show_pie_chart}
               onChange={this.props.onChange}
               help="用饼图显示数据" />

        <Input key="showDataTable"
               type="checkbox"
               id="quickvalues-show-data-table"
               name="show_data_table"
               label="显示数据列表"
               checked={this.props.config.show_data_table}
               onChange={this.props.onChange}
               help="显示数据列表." />
      </fieldset>
    );
  },
});

export default QuickValuesWidgetCreateConfiguration;
