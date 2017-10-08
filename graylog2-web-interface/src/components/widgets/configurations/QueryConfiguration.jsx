import React, { PropTypes } from 'react';
import { Input } from 'components/bootstrap';

const QueryConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  render() {
    return (
      <Input type="text"
             key="query"
             id="query"
             name="query"
             label="搜索语句"
             defaultValue={this.props.config.query}
             onChange={this.props.onChange}
             help="获取组件值的搜索语句." />
    );
  },
});

export default QueryConfiguration;
