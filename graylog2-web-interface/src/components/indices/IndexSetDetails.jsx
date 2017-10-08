import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IndicesConfiguration } from 'components/indices';

const style = require('!style/useable!css!./IndexSetDetails.css');

const IndexSetDetails = React.createClass({
  propTypes: {
    indexSet: React.PropTypes.object.isRequired,
  },

  componentDidMount() {
    style.use();
  },

  componentWillUnmount() {
    style.unuse();
  },

  render() {
    const indexSet = this.props.indexSet;

    return (
      <Row className="index-set-details">
        <Col md={3}>
          <dl>
            <dt>索引前缀:</dt>
            <dd>{indexSet.index_prefix}</dd>

            <dt>分片:</dt>
            <dd>{indexSet.shards}</dd>

            <dt>备份分片:</dt>
            <dd>{indexSet.replicas}</dd>
          </dl>
        </Col>

        <Col md={6}>
          <IndicesConfiguration indexSet={indexSet} />
        </Col>
      </Row>
    );
  },
});

export default IndexSetDetails;
