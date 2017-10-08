import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

import CombinedProvider from 'injection/CombinedProvider';

import Routes from 'routing/Routes';

import { ErrorPopover } from 'components/lookup-tables';
import { ContentPackMarker } from 'components/common';

const { LookupTablesActions } = CombinedProvider.get('LookupTables');

const LUTTableEntry = React.createClass({

  propTypes: {
    table: React.PropTypes.object.isRequired,
    cache: React.PropTypes.object.isRequired,
    dataAdapter: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      errors: {
        table: null,
        cache: null,
        dataAdapter: null,
      },
    };
  },

  _onDelete() {
// eslint-disable-next-line no-alert
    if (window.confirm(`确定要删除查找表 "${this.props.table.title}"?`)) {
      LookupTablesActions.delete(this.props.table.id).then(() => LookupTablesActions.reloadPage());
    }
  },

  render() {
    return (<tbody>
      <tr>
        <td>
          {this.props.errors.table && (<ErrorPopover placement="right" errorText={this.props.errors.table} title="查找表问题" />) }
          <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.show(this.props.table.name)}><a>{this.props.table.title}</a></LinkContainer>
          <ContentPackMarker contentPack={this.props.table.content_pack} marginLeft={5} />
        </td>
        <td>{this.props.table.description}</td>
        <td>{this.props.table.name}</td>
        <td>
          {this.props.errors.cache && (<ErrorPopover placement="bottom" errorText={this.props.errors.cache} title="缓存问题" />) }
          <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CACHES.show(this.props.cache.name)}><a>{this.props.cache.title}</a></LinkContainer>
        </td>
        <td>
          {this.props.errors.dataAdapter && (<ErrorPopover placement="bottom" errorText={this.props.errors.dataAdapter} title="数据转接器问题" />) }
          <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.DATA_ADAPTERS.show(this.props.dataAdapter.name)}><a>{this.props.dataAdapter.title}</a></LinkContainer>
        </td>
        <td>
          <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.edit(this.props.table.name)}>
            <Button bsSize="xsmall" bsStyle="info">编辑</Button>
          </LinkContainer>
          &nbsp;
          <Button bsSize="xsmall" bsStyle="primary" onClick={this._onDelete}>删除</Button>
        </td>
      </tr>
    </tbody>);
  },

});

export default LUTTableEntry;

