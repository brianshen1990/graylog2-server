import React from 'react';
import Reflux from 'reflux';
import Version from 'util/Version';

import StoreProvider from 'injection/StoreProvider';
const SystemStore = StoreProvider.getStore('System');

const Footer = React.createClass({
  mixins: [Reflux.connect(SystemStore)],
  componentDidMount() {
    SystemStore.jvm().then(jvmInfo => this.setState({ jvm: jvmInfo }));
  },
  _isLoading() {
    return !(this.state.system && this.state.jvm);
  },
  render() {
    if (this._isLoading()) {
      return (
        <div id="footer">
          xxxx 日志平台
        </div>
      );
    }

    return (
      <div id="footer">
        xxxx 日志平台
      </div>
    );
  },
});

export default Footer;
