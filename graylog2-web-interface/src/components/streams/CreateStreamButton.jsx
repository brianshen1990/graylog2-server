import React from 'react';
import { Button } from 'react-bootstrap';
import StreamForm from 'components/streams/StreamForm';

const CreateStreamButton = React.createClass({
  propTypes: {
    buttonText: React.PropTypes.string,
    bsStyle: React.PropTypes.string,
    bsSize: React.PropTypes.string,
    className: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    indexSets: React.PropTypes.array.isRequired,
  },
  getDefaultProps() {
    return {
      buttonText: '创建数据流',
    };
  },
  onClick() {
    this.refs.streamForm.open();
  },
  render() {
    return (
      <span>
        <Button bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} className={this.props.className}
                onClick={this.onClick}>
          {this.props.buttonText}
        </Button>
        <StreamForm ref="streamForm" title="数据流创建中" indexSets={this.props.indexSets}
                    onSubmit={this.props.onSave} />
      </span>
    );
  },
});

export default CreateStreamButton;
