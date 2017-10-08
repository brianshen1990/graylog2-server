import React, { PropTypes } from 'react';
import { Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import Routes from 'routing/Routes';

import CombinedProvider from 'injection/CombinedProvider';
import { LinkContainer } from 'react-router-bootstrap';

import { PaginatedList, SearchForm, Spinner } from 'components/common';

import CacheTableEntry from 'components/lookup-tables/CacheTableEntry';

import Styles from './Overview.css';

const { LookupTableCachesActions } = CombinedProvider.get('LookupTableCaches');

const CachesOverview = React.createClass({

  propTypes: {
    caches: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
  },

  _onPageChange(newPage, newPerPage) {
    LookupTableCachesActions.searchPaginated(newPage, newPerPage, this.props.pagination.query);
  },

  _onSearch(query, resetLoadingStateCb) {
    LookupTableCachesActions
      .searchPaginated(this.props.pagination.page, this.props.pagination.per_page, query)
      .then(resetLoadingStateCb);
  },

  _onReset() {
    LookupTableCachesActions.searchPaginated(this.props.pagination.page, this.props.pagination.per_page);
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
              <td>缓存 ID</td>
            </tr>
            <tr>
              <td>标题</td>
              <td>缓存的标题</td>
            </tr>
            <tr>
              <td>名称</td>
              <td>缓存名称</td>
            </tr>
            <tr>
              <td>描述</td>
              <td>缓存描述</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>示例</strong></p>
        <p>
          使用名称查找缓存:<br />
          <kbd>{'name:guava'}</kbd><br />
          <kbd>{'name:gua'}</kbd>
        </p>
        <p>
          使用 <code>标题</code>查找:<br />
          <kbd>{'guava'}</kbd> <br />于此效果一致<br />
          <kbd>{'title:guava'}</kbd>
        </p>
      </Popover>
    );
  },

  render() {
    if (!this.props.caches) {
      return <Spinner text="导入缓存" />;
    }
    const caches = this.props.caches.map((cache) => {
      return (<CacheTableEntry key={cache.id}
                               cache={cache} />);
    });

    return (<div>
      <Row className="content">
        <Col md={12}>
          <h2>
            已配置缓存
            <span>&nbsp;
              <small>共{this.props.pagination.total}条</small></span>
          </h2>
          <PaginatedList onChange={this._onPageChange} totalItems={this.props.pagination.total}>
            <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
              <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CACHES.CREATE}>
                <Button bsStyle="success" style={{ marginLeft: 5 }}>新建缓存</Button>
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
                  <th>缓存数</th>
                  <th>命中率</th>
                  <th>查找数目</th>
                  <th className={Styles.actions}>操作</th>
                </tr>
              </thead>
              {caches}
            </Table>
          </PaginatedList>
        </Col>
      </Row>
    </div>);
  },
});

export default CachesOverview;
