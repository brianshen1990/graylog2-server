import React from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import { ContactUs, DocumentationLink } from 'components/support';
import DocsHelper from 'util/DocsHelper';

const MalformedSearchQuery = React.createClass({
  propTypes: {
    error: React.PropTypes.object.isRequired,
  },

  _isGenericError(error) {
    return error.column === null || error.line === null;
  },

  _getFormattedErrorDetails(details) {
    return details.map(function(detail) {
        return <li><code>{detail}</code></li>
    });
  },

  _getFormattedErrorDescription(error) {
    return (
      <Panel bsStyle="danger">
        <dl style={{ marginBottom: 0 }}>
          <dt>错误消息:</dt>
          <dd>{error.message}</dd>
          <dt>详细信息:</dt>
          <dd>{this._getFormattedErrorDetails(error.details)}</dd>
        </dl>
      </Panel>
    );
  },

  render() {
    const error = this.props.error.body;

    let explanation;
    if (this._isGenericError(error)) {
      explanation = (
        <div>
          <p>搜索语句错在错误, 执行出错:</p>
          {this._getFormattedErrorDescription(error)}
        </div>
      );
    } else {
      explanation = (
        <div>
          {this._getFormattedErrorDescription(error)}
        </div>
      );
    }

    return (
      <div>
        <Row className="content content-head">
          <Col md={12}>

            <h1>
              Malformed search query
            </h1>

            <p className="description">
              搜索语句无法执行, 请更正并重新尝试.
            </p>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            {explanation}
          </Col>
        </Row>

        <ContactUs />
      </div>
    );
  },
});

export default MalformedSearchQuery;
