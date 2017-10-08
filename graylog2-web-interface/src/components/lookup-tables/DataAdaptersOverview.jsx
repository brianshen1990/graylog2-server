import React, { PropTypes } from 'react';
import { Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import Routes from 'routing/Routes';

import CombinedProvider from 'injection/CombinedProvider';
import { LinkContainer } from 'react-router-bootstrap';

import { PaginatedList, SearchForm, Spinner } from 'components/common';

import DataAdapterTableEntry from 'components/lookup-tables/DataAdapterTableEntry';

import Styles from './Overview.css';

const { LookupTableDataAdaptersActions } = CombinedProvider.get('LookupTableDataAdapters');

const DataAdaptersOverview = React.createClass({

  propTypes: {
    dataAdapters: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    errorStates: PropTypes.object.isRequired,
  },

  _onPageChange(newPage, newPerPage) {
    LookupTableDataAdaptersActions.searchPaginated(newPage, newPerPage,
      this.props.pagination.query);
  },

  _onSearch(query, resetLoadingStateCb) {
    LookupTableDataAdaptersActions
      .searchPaginated(this.props.pagination.page, this.props.pagination.per_page, query)
      .then(resetLoadingStateCb);
  },

  _onReset() {
    LookupTableDataAdaptersActions.searchPaginated(this.props.pagination.page, this.props.pagination.per_page);
  },

  _helpPopover() {
    return (
      <Popover id="search-query-help" className={Styles.popoverWide} title="查找语法帮助">
        <p><strong>可使用查找字段</strong></p>
        <Table condensed>
          <thead>
          <tr>
            <th>字段</th>
            <th>描述</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>id</td>
            <td>数据转接器 ID</td>
          </tr>
          <tr>
            <td>标题</td>
            <td>数据转接器的标题</td>
          </tr>
          <tr>
            <td>名称</td>
            <td>数据转接器的名称(用于查找)</td>
          </tr>
          <tr>
            <td>描述</td>
            <td>数据转接器的描述</td>
          </tr>
          </tbody>
        </Table>
        <p><strong>示例</strong></p>
        <p>
          使用数据转接器的名称来查找：<br />
          <kbd>{'name:geoip'}</kbd><br />
          <kbd>{'name:geo'}</kbd>
        </p>
        <p>
          不使用<em>标题</em>字段查找：<br />
          <kbd>{'geoip'}</kbd> <br />与此相等同<br />
          <kbd>{'title:geoip'}</kbd>
        </p>
      </Popover>
    );
  },

  render() {
    if (!this.props.dataAdapters) {
      return <Spinner text="Loading data adapters" />;
    }
    const dataAdapters = this.props.dataAdapters.map((dataAdapter) => {
      return (<DataAdapterTableEntry key={dataAdapter.id}
                                     adapter={dataAdapter}
                                     error={this.props.errorStates.dataAdapters[dataAdapter.name]} />);
    });

    return (<div>
      <Row className="content">
        <Col md={12}>
          <h2>
            配置查找表数据转接器
            <span>&nbsp;
              <small>共{this.props.pagination.total}条</small></span>
          </h2>
          <PaginatedList onChange={this._onPageChange} totalItems={this.props.pagination.total}>
            <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
              <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.DATA_ADAPTERS.CREATE}>
                <Button bsStyle="success" style={{ marginLeft: 5 }}>创建数据转接器</Button>
              </LinkContainer>
              <OverlayTrigger trigger="click" rootClose placement="right" overlay={this._helpPopover()}>
                <Button bsStyle="link" className={Styles.searchHelpButton}><i className="fa fa-fw fa-question-circle" /></Button>
              </OverlayTrigger>
            </SearchForm>
            <Table condensed hover>
              <thead>
                <tr>
                  <th>标题</th>
                  <th>描述</th>
                  <th>名称</th>
                  <th>生产量</th>
                  <th className={Styles.actions}>操作</th>
                </tr>
              </thead>
              {dataAdapters}
            </Table>
          </PaginatedList>
        </Col>
      </Row>
    </div>);
  },
});

export default DataAdaptersOverview;
