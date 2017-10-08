import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';

import { Cache, CacheCreate, CacheForm, CachesOverview } from 'components/lookup-tables';

import CombinedProvider from 'injection/CombinedProvider';

const { LookupTableCachesStore, LookupTableCachesActions } = CombinedProvider.get(
  'LookupTableCaches');

const LUTCachesPage = React.createClass({
  propTypes: {
// eslint-disable-next-line react/no-unused-prop-types
    params: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  },

  mixins: [
    Reflux.connect(LookupTableCachesStore),
  ],

  componentDidMount() {
    this._loadData(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this._loadData(nextProps);
  },

  _loadData(props) {
    if (props.params && props.params.cacheName) {
      LookupTableCachesActions.get(props.params.cacheName);
    } else if (this._isCreating(props)) {
      LookupTableCachesActions.getTypes();
    } else {
      const p = this.state.pagination;
      LookupTableCachesActions.searchPaginated(p.page, p.per_page, p.query);
    }
  },

  _saved() {
    // reset detail state
    this.setState({ cache: undefined });
    this.props.history.pushState(null, Routes.SYSTEM.LOOKUPTABLES.CACHES.OVERVIEW);
  },

  _isCreating(props) {
    return props.route.action === 'create';
  },

  _validateCache(adapter) {
    LookupTableCachesActions.validate(adapter);
  },

  render() {
    let content;
    const isShowing = this.props.route.action === 'show';
    const isEditing = this.props.route.action === 'edit';

    if (isShowing || isEditing) {
      if (!this.state.cache) {
        content = <Spinner text="Loading data cache" />;
      } else if (isEditing) {
        content = (
          <Row className="content">
            <Col lg={12}>
              <h2>Data Cache</h2>
              <CacheForm cache={this.state.cache}
                         type={this.state.cache.config.type}
                         create={false}
                         saved={this._saved}
                         validate={this._validateCache}
                         validationErrors={this.state.validationErrors} />
            </Col>
          </Row>
        );
      } else {
        content = <Cache cache={this.state.cache} />;
      }
    } else if (this._isCreating(this.props)) {
      if (!this.state.types) {
        content = <Spinner text="Loading data cache types" />;
      } else {
        content =
          (<CacheCreate history={this.props.history}
                       types={this.state.types}
                       saved={this._saved}
                       validate={this._validateCache}
                       validationErrors={this.state.validationErrors} />);
      }
    } else if (!this.state.caches) {
      content = <Spinner text="Loading caches" />;
    } else {
      content = (<CachesOverview caches={this.state.caches}
                                 pagination={this.state.pagination} />);
    }

    return (
      <DocumentTitle title="查找表 - 缓存">
        <span>
          <PageHeader title="查找表 - 缓存">
            <span>缓存为查找表提供实际值。</span>
            {null}
            <span>
              {(isShowing || isEditing) && (
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CACHES.edit(this.props.params.cacheName)}
                               onlyActiveOnIndex>
                  <Button bsStyle="success">修改</Button>
                </LinkContainer>
              )}
              &nbsp;
              {(isShowing || isEditing) && (
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CACHES.OVERVIEW}
                               onlyActiveOnIndex>
                  <Button bsStyle="info">缓存</Button>
                </LinkContainer>
              )}
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.OVERVIEW} onlyActiveOnIndex>
                <Button bsStyle="info">查找表</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.DATA_ADAPTERS.OVERVIEW}
                             onlyActiveOnIndex>
                <Button bsStyle="info">数据转接器</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          {content}
        </span>
      </DocumentTitle>
    );
  },
});

export default LUTCachesPage;
