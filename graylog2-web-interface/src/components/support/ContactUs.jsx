import React from 'react';
import { Col, Row } from 'react-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

const ContactUs = React.createClass({
  render() {
    return (
      <Row className="content">
        <Col md={12}>
          <div className="support-sources">
            <h2>需要帮助?</h2>
            <p>
              请联系 xxxx ，如果您的问题不能在帮助文档中搜索到结果.
            </p>
            <ul>
              <li>
                <i className="fa fa-group" />&nbsp;
                <a href="#" target="_blank">联系 xxxx</a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    );
  },
});

export default ContactUs;
