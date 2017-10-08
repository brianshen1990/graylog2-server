import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const GrokPatternsStore = StoreProvider.getStore('GrokPatterns');

import PageHeader from 'components/common/PageHeader';
import EditPatternModal from 'components/grok-patterns/EditPatternModal';
import BulkLoadPatternModal from 'components/grok-patterns/BulkLoadPatternModal';
import DataTable from 'components/common/DataTable';

const GrokPatterns = React.createClass({
  getInitialState() {
    return {
      patterns: [],
    };
  },
  componentDidMount() {
    this.loadData();
  },
  loadData() {
    GrokPatternsStore.loadPatterns((patterns) => {
      if (this.isMounted()) {
        this.setState({
          patterns: patterns,
        });
      }
    });
  },
  validPatternName(name) {
    // Check if patterns already contain a pattern with the given name.
    return !this.state.patterns.some(pattern => pattern.name === name);
  },
  savePattern(pattern, callback) {
    GrokPatternsStore.savePattern(pattern, () => {
      callback();
      this.loadData();
    });
  },
  confirmedRemove(pattern) {
    if (window.confirm(`确定要删除 ${pattern.name}?\n 删除会造成所有使用该模式的提取器失效。 `)) {
      GrokPatternsStore.deletePattern(pattern, this.loadData);
    }
  },
  _headerCellFormatter(header) {
    let formattedHeaderCell;

    switch (header.toLocaleLowerCase()) {
      case '名称':
        formattedHeaderCell = <th className="name">{header}</th>;
        break;
      case '操作':
        formattedHeaderCell = <th className="actions">{header}</th>;
        break;
      default:
        formattedHeaderCell = <th>{header}</th>;
    }

    return formattedHeaderCell;
  },
  _patternFormatter(pattern) {
    return (
      <tr key={pattern.id}>
        <td>{pattern.name}</td>
        <td>{pattern.pattern}</td>
        <td>
          <Button style={{ marginRight: 5 }} bsStyle="primary" bsSize="xs"
                  onClick={this.confirmedRemove.bind(this, pattern)}>
            删除
          </Button>
          <EditPatternModal id={pattern.id} name={pattern.name} pattern={pattern.pattern} create={false}
                            reload={this.loadData} savePattern={this.savePattern}
                            validPatternName={this.validPatternName} />
        </td>
      </tr>
    );
  },
  render() {
    const headers = ['名称', '模式', '操作'];
    const filterKeys = ['name'];

    return (
      <div>
        <PageHeader title="Grok 模式">
          <span>
            以下的Grok 模式列表，您可以在提取器使用。 您也可以添加您自己的Grok 模式。
          </span>
          {null}
          <span>
            <BulkLoadPatternModal onSuccess={this.loadData} />
            <EditPatternModal id={''} name={''} pattern={''} create
                              reload={this.loadData}
                              savePattern={this.savePattern}
                              validPatternName={this.validPatternName} />
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <DataTable id="grok-pattern-list"
                       className="table-striped table-hover"
                       headers={headers}
                       headerCellFormatter={this._headerCellFormatter}
                       sortByKey={'name'}
                       rows={this.state.patterns}
                       dataRowFormatter={this._patternFormatter}
                       filterLabel="筛选模式"
                       filterKeys={filterKeys} />
          </Col>
        </Row>
      </div>
    );
  },
});

export default GrokPatterns;
