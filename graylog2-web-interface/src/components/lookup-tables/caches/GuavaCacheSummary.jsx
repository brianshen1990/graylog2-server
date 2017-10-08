import React, { PropTypes } from 'react';
import { TimeUnit } from 'components/common';

const GuavaCacheSummary = React.createClass({
  propTypes: {
    cache: PropTypes.object.isRequired,
  },

  render() {
    const config = this.props.cache.config;
    return (<dl>
      <dt>最大缓存数</dt>
      <dd>{config.max_size}</dd>
      <dt>获取后失效时间</dt>
      <dd><TimeUnit value={config.expire_after_access} unit={config.expire_after_access_unit} /></dd>
      <dt>写入后失效</dt>
      <dd><TimeUnit value={config.expire_after_write} unit={config.expire_after_write_unit} /></dd>
    </dl>);
  },
});

export default GuavaCacheSummary;
