import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

import { DataTable, Spinner } from 'components/common';

const PluginsDataTable = React.createClass({
  propTypes: {
    plugins: PropTypes.array,
  },
  _headerCellFormatter(header) {
    return <th>{header}</th>;
  },
  _pluginInfoFormatter(plugin) {
    return (
      <tr key={plugin.name}>
        <td className="limited">{plugin.name}</td>
        <td className="limited">{plugin.version}</td>
        <td className="limited">{plugin.author}</td>
        <td className="limited" style={{ width: '50%' }}>
          {plugin.description}
          &nbsp;
          <a href={plugin.url} target="_blank" style={{ marginLeft: 10 }}><i className="fa fa-external-link" /> 网站</a>
        </td>
      </tr>
    );
  },
  render() {
    if (!this.props.plugins) {
      return <Spinner text="正在从此节点中加载插件..." />;
    }

    if (this.props.plugins.length === 0) {
      return <Alert bsStyle="info"><i className="fa fa-info-circle" />&nbsp; 此节点没有插件.</Alert>;
    }

    const headers = ['名称', '版本', '作者', '描述'];

    return (
      <DataTable id="plugin-list"
                 rowClassName="row-sm"
                 className="table-hover table-condensed table-striped"
                 headers={headers}
                 headerCellFormatter={this._headerCellFormatter}
                 sortByKey={'name'}
                 rows={this.props.plugins}
                 dataRowFormatter={this._pluginInfoFormatter}
                 filterLabel="筛选"
                 filterKeys={[]} />
    );
  },
});

export default PluginsDataTable;
