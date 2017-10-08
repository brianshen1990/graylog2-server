import React from 'react';

const CSVFileAdapterSummary = React.createClass({
  propTypes: {
    dataAdapter: React.PropTypes.object.isRequired,
  },

  render() {
    const config = this.props.dataAdapter.config;
    return (<dl>
      <dt>文件路径</dt>
      <dd>{config.path}</dd>
      <dt>分隔符号</dt>
      <dd><code>{config.separator}</code></dd>
      <dt>引用符号</dt>
      <dd><code>{config.quotechar}</code></dd>
      <dt>关键字列</dt>
      <dd>{config.key_column}</dd>
      <dt>值列</dt>
      <dd>{config.value_column}</dd>
      <dt>查询间隔</dt>
      <dd>{config.check_interval} seconds</dd>
      <dt>区分大小写</dt>
      <dd>{config.case_insensitive_lookup ? '是' : '否'}</dd>
    </dl>);
  },
});


export default CSVFileAdapterSummary;
