/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Alert } from 'react-bootstrap';

const GuavaCacheDocumentation = React.createClass({
  render() {
    return (<div>
      <p>内存缓存会将数据转接器最近使用的数据进行保存。</p>
      <p>请确保xxxx 日志平台有足够的内存。</p>

      <Alert style={{ marginBottom: 10 }} bsStyle="info">
        <h4 style={{ marginBottom: 10 }}>实行细节</h4>
        <p>数据缓存是单台 xxxx 日志平台缓存，并不共享。</p>
        <p>如果您有两台，那么每台都会缓存自己的数据。</p>
      </Alert>

      <hr />

      <h3 style={{ marginBottom: 10 }}>缓存大小</h3>
      <p>每个缓存都有最大的条目数。</p>

      <h3 style={{ marginBottom: 10 }}>过期时间</h3>

      <h5 style={{ marginBottom: 10 }}>使用后过期</h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        最后一次使用后超过一定时间则会从缓存中清除.<br />
        这将使得系统占用有限的资源。
      </p>

      <h5 style={{ marginBottom: 10 }}>写入后过期</h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        当被写入缓存后，指定时间内会被清除。.<br />
        这将是的所有的缓存都不会保存超过固定时间。
      </p>

    </div>);
  },
});

export default GuavaCacheDocumentation;
