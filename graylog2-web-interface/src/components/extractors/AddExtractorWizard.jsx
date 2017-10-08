import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import LoaderTabs from 'components/messageloaders/LoaderTabs';
import MessageFieldExtractorActions from 'components/search/MessageFieldExtractorActions';

const AddExtractorWizard = React.createClass({
  propTypes: {
    inputId: PropTypes.string,
  },
  getInitialState() {
    return {
      showExtractorForm: false,
    };
  },
  _showAddExtractorForm() {
    this.setState({ showExtractorForm: !this.state.showExtractorForm });
  },
  render() {
    let extractorForm;

    if (this.state.showExtractorForm) {
      // Components using this component, will give it a proper fieldName and message
      const extractorFieldActions = <MessageFieldExtractorActions fieldName="" message={{}} />;
      extractorForm = (
        <div className="stream-loader">
          <LoaderTabs selectedInputId={this.props.inputId} customFieldActions={extractorFieldActions} />
        </div>
      );
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2 style={{ marginBottom: 5 }}>添加提取器</h2>

          <p>
            可以选取一条消息作为示例来测试。你可以选取最近的一条消息或者通过ID指定任意一条信息。
          </p>
          <p>
            <Button bsStyle="info" bsSize="small" onClick={this._showAddExtractorForm} disabled={this.state.showExtractorForm}>
              开始
            </Button>
          </p>

          {extractorForm}
        </Col>
      </Row>
    );
  },
});

export default AddExtractorWizard;
