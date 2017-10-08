import React from 'react';
import { Col, Jumbotron, Row } from 'react-bootstrap';

import style from '!style/useable!css!pages/NotFoundPage.css';

const PageErrorOverview = React.createClass({
  propTypes: {
    errors: React.PropTypes.array.isRequired,
  },
  componentDidMount() {
    style.use();
  },

  componentWillUnmount() {
    style.unuse();
  },

  _formatErrors(errors) {
    const formattedErrors = errors ? errors.map(error => <li>{error.toString()}</li>) : [];
    return (
      <ul>
        {formattedErrors}
        <li>检查服务器日志获取更多信息.</li>
      </ul>
    );
  },
  render() {
    return (
      <Row className="jumbotron-container">
        <Col mdOffset={2} md={8}>
          <Jumbotron>
            <h1>获取数据出错</h1>
            <p>系统在获取数据时出错.</p>
            {this._formatErrors(this.props.errors)}
          </Jumbotron>
        </Col>
      </Row>
    );
  },
});

export default PageErrorOverview;
