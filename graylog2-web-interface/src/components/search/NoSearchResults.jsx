import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { AddSearchCountToDashboard, SavedSearchControls, ShowQueryModal } from 'components/search';
import AddToDashboardMenu from 'components/dashboard/AddToDashboardMenu';
import { ContactUs, DocumentationLink } from 'components/support';

import DocsHelper from 'util/DocsHelper';

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');

const NoSearchResults = React.createClass({
  propTypes: {
    builtQuery: React.PropTypes.string,
    histogram: React.PropTypes.object.isRequired,
    permissions: React.PropTypes.array.isRequired,
    searchInStream: React.PropTypes.object,
  },

  componentDidMount() {
    this.style.use();
  },

  componentWillUnmount() {
    this.style.unuse();
  },

  style: require('!style/useable!css!./NoSearchResults.css'),

  _showQueryModal(event) {
    event.preventDefault();
    this.refs.showQueryModal.open();
  },

  render() {
    let streamDescription = null;
    if (this.props.searchInStream) {
      streamDescription = <span>in stream <em>{this.props.searchInStream.title}</em></span>;
    }

    return (
      <div>
        <Row className="content content-head">
          <Col md={12}>
            <h1>未找到 {streamDescription}</h1>

            <p className="description">
              本次搜索没有结果，可尝试改变搜索时间范围或者搜索条件。{' '}
              更多细节 <a href="#" onClick={this._showQueryModal}>显示Elasticsearch搜索</a>.
              <ShowQueryModal key="debugQuery" ref="showQueryModal" builtQuery={this.props.builtQuery} />
              <br />
            </p>
          </Col>
        </Row>
        <Row className="content search-actions">
          <Col md={12}>
            <Row className="row-sm">
              <Col md={4}>
                <h2>搜索动作</h2>
              </Col>
              <Col md={8}>
                <div className="actions">
                  <AddSearchCountToDashboard searchInStream={this.props.searchInStream}
                                             permissions={this.props.permissions} pullRight />
                  <AddToDashboardMenu title="添加柱状图到显示面板"
                                      widgetType="SEARCH_RESULT_CHART"
                                      configuration={{ interval: this.props.histogram.interval }}
                                      pullRight
                                      permissions={this.props.permissions} />
                  <SavedSearchControls currentSavedSearch={SearchStore.savedSearch} pullRight />
                </div>
              </Col>
            </Row>

            <p>
              如果期望本次搜索在将来能返回结果，可将搜索插件添加到显示面板，并且在此管理已存储搜索。
            </p>
          </Col>
        </Row>
        <ContactUs />
      </div>
    );
  },
});

export default NoSearchResults;
