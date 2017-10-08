import React from 'react';
import { Alert, Table } from 'react-bootstrap';

import { IndexerFailure } from 'components/indexers';

const IndexerFailuresList = React.createClass({
  propTypes: {
    failures: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },
  render() {
    if (this.props.failures.length === 0) {
      return (
        <Alert bsStyle="success"><i className="fa fa-check-circle" /> 恭喜! 没有 indexer 失败.</Alert>
      );
    }

    return (
      <div className="scrollable-table">
        <Table className="indexer-failures" striped hover condensed>
          <thead>
            <tr>
              <th style={{ width: 200 }}>时间戳</th>
              <th>索引</th>
              <th>信息 ID</th>
              <th>错误内容</th>
            </tr>
          </thead>
          <tbody>
            {this.props.failures.map(failure => <IndexerFailure key={`indexer-failure-${failure.letter_id}`} failure={failure} />)}
          </tbody>
        </Table>
      </div>
    );
  },
});

export default IndexerFailuresList;
