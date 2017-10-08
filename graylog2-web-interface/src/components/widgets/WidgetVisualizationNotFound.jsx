import React from 'react';
import { Alert } from 'react-bootstrap';

const WidgetVisualizationNotFound = React.createClass({
  propTypes: {
    widgetClassName: React.PropTypes.string.isRequired,
  },
  render() {
    return (
      <Alert bsStyle="danger">
        <i className="fa fa-exclamation-circle" /> 可视化组件 (<i>{this.props.widgetClassName}</i>) 丢失.

        可能的原因是显示组件没有被加载.
      </Alert>
    );
  },
});

export default WidgetVisualizationNotFound;
