import React, { PropTypes } from 'react';
import { Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';

import CombinedProvider from 'injection/CombinedProvider';

import { PaginatedList, SearchForm } from 'components/common';
import LUTTableEntry from 'components/lookup-tables/LUTTableEntry';

import Styles from './Overview.css';

const { LookupTablesActions } = CombinedProvider.get('LookupTables');

const LookupTablesOverview = React.createClass({

  propTypes: {
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    caches: PropTypes.objectOf(PropTypes.object).isRequired,
    dataAdapters: PropTypes.objectOf(PropTypes.object).isRequired,
    pagination: PropTypes.object.isRequired,
    errorStates: PropTypes.object.isRequired,
  },

  _onPageChange(newPage, newPerPage) {
    LookupTablesActions.searchPaginated(newPage, newPerPage, this.props.pagination.query);
  },

  _onSearch(query, resetLoadingStateCb) {
    LookupTablesActions
      .searchPaginated(this.props.pagination.page, this.props.pagination.per_page, query)
      .then(resetLoadingStateCb);
  },

  _onReset() {
    LookupTablesActions.searchPaginated(this.props.pagination.page, this.props.pagination.per_page);
  },

  _lookupName(id, map) {
    const empty = { title: 'None' };
    if (!map) {
      return empty;
    }
    return map[id] || empty;
  },

  _lookupAdapterError(table) {
    if (this.props.errorStates.dataAdapters && this.props.dataAdapters) {
      const adapter = this.props.dataAdapters[table.data_adapter_id];
      if (!adapter) {
        return null;
      }
      return this.props.errorStates.dataAdapters[adapter.name];
    }
    return null;
  },

  _helpPopover() {
    return (
      <Popover id="search-query-help" className={Styles.popoverWide} title="查找语法帮助">
        <p><strong>可搜索字段</strong></p>
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
            <td>查找表 ID</td>
          </tr>
          <tr>
            <td>标题</td>
            <td>查找表标题</td>
          </tr>
          <tr>
            <td>名称</td>
            <td>查找表名称</td>
          </tr>
          <tr>
            <td>描述</td>
            <td>查找表描述</td>
          </tr>
          </tbody>
        </Table>
        <p><strong>示例</strong></p>
        <p>
          使用部分的名称来查找：<br />
          <kbd>{'name:geoip'}</kbd><br />
          <kbd>{'name:geo'}</kbd>
        </p>
        <p>
          不指定字段查找： <code>title</code>:<br />
          <kbd>{'geoip'}</kbd> <br />与此查找等同。<br />
          <kbd>{'title:geoip'}</kbd>
        </p>
      </Popover>
    );
  },

  render() {
    const lookupTables = this.props.tables.map((table) => {
      const cache = this._lookupName(table.cache_id, this.props.caches);
      const dataAdapter = this._lookupName(table.data_adapter_id, this.props.dataAdapters);
      const errors = {
        table: this.props.errorStates.tables[table.name],
        cache: null,
        dataAdapter: this._lookupAdapterError(table),
      };

      return (<LUTTableEntry key={table.id}
                             table={table}
                             cache={cache}
                             dataAdapter={dataAdapter}
                             errors={errors} />);
    });

    return (<div>
      <Row className="content">
        <Col md={12}>
          <h2>
            配置查找表
            <span>&nbsp;<small>共{this.props.pagination.total}条</small></span>
          </h2>
          <PaginatedList onChange={this._onPageChange} totalItems={this.props.pagination.total}>
            <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
              <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CREATE}>
                <Button bsStyle="success" style={{ marginLeft: 5 }}>新建查找表</Button>
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
                  <th>缓存</th>
                  <th>数据转接器</th>
                  <th className={Styles.actions}>操作</th>
                </tr>
              </thead>
              {lookupTables}
            </Table>
          </PaginatedList>
        </Col>
      </Row>
    </div>);
  },
});

export default LookupTablesOverview;
