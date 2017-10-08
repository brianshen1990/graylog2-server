import React, { PropTypes } from 'react';
import { Input } from 'components/bootstrap';

import { QueryConfiguration } from 'components/widgets/configurations';
import StoreProvider from 'injection/StoreProvider';
const FieldGraphsStore = StoreProvider.getStore('FieldGraphs');

const FieldChartWidgetConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  render() {
    return (
      <fieldset>
        <QueryConfiguration {...this.props} />
        <Input key="fieldChartStatisticalFunction"
               id="chart-statistical-function"
               name="valuetype"
               type="select"
               label="统计功能"
               defaultValue={this.props.config.valuetype}
               onChange={this.props.onChange}
               help="应用在数据的统计功能.">
          {FieldGraphsStore.constructor.FUNCTIONS.keySeq().map((statFunction) => {
            return (
              <option key={statFunction} value={statFunction}>
                {FieldGraphsStore.constructor.FUNCTIONS.get(statFunction)}
              </option>
            );
          })}
        </Input>
      </fieldset>
    );
  },
});

export default FieldChartWidgetConfiguration;
