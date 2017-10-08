import React from "react";
import {Col, Panel, Row} from "react-bootstrap";

import {ContactUs} from "components/support";

const SearchExecutionError = React.createClass({
  propTypes: {
    error: React.PropTypes.object.isRequired,
  },

  _getFormattedErrorDetails(details) {
      return details.map(function(detail) {
          return <li><code>{detail}</code></li>
      });
  },

  render() {
    const error = this.props.error;
    return (
      <div>
        <Row className="content content-head">
          <Col md={12}>

            <h1>
              无法执行查询
            </h1>

            <div>
              <p>执行查询失败, 请查询日志..</p>
              <Panel bsStyle="danger">
                <dl style={{ marginBottom: 0 }}>
                  <dt>错误消息:</dt>
                  <dd>{error.body.message ? error.body.message : ''}</dd>
                  <dt>详细信息:</dt>
                  <dd>{error.body.message ? this._getFormattedErrorDetails(error.body.details) : ''}</dd>
                  <dt>搜索状态错误码:</dt>
                  <dd>{error.status}</dd>
                  <dt>搜索响应:</dt>
                  <dd>{error.message}</dd>
                </dl>
              </Panel>
            </div>
          </Col>
        </Row>

        <ContactUs />
      </div>
    );
  },
});

export default SearchExecutionError;
