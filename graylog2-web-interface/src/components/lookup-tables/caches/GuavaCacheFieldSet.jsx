import React, { PropTypes } from 'react';
import ObjectUtils from 'util/ObjectUtils';

import { Input } from 'components/bootstrap';
import { TimeUnitInput } from 'components/common';

const GuavaCacheFieldSet = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired,
    handleFormEvent: PropTypes.func.isRequired,
// eslint-disable-next-line react/no-unused-prop-types
    validationState: PropTypes.func.isRequired,
// eslint-disable-next-line react/no-unused-prop-types
    validationMessage: PropTypes.func.isRequired,
  },

  _update(value, unit, enabled, name) {
    const config = ObjectUtils.clone(this.props.config);
    config[name] = enabled ? value : 0;
    config[`${name}_unit`] = unit;
    this.props.updateConfig(config);
  },

  updateAfterAccess(value, unit, enabled) {
    this._update(value, unit, enabled, 'expire_after_access');
  },

  updateAfterWrite(value, unit, enabled) {
    this._update(value, unit, enabled, 'expire_after_write');
  },

  updateRefresh(value, unit, enabled) {
    this._update(value, unit, enabled, 'refresh_after_write');
  },

  render() {
    const config = this.props.config;

    return (<fieldset>
      <Input type="text"
             id="max_size"
             name="max_size"
             label="最大缓存数"
             autoFocus
             required
             onChange={this.props.handleFormEvent}
             help="在内存中保存的数目。"
             value={config.max_size}
             labelClassName="col-sm-3"
             wrapperClassName="col-sm-9" />
      <TimeUnitInput label="使用后失效时间"
                     help="开启后，在使用后的固定时间内失效。"
                     update={this.updateAfterAccess}
                     value={config.expire_after_access}
                     unit={config.expire_after_access_unit || 'SECONDS'}
                     enabled={config.expire_after_access > 0}
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9" />
      <TimeUnitInput label="写入后失效"
                     help="开启后，在第一次使用后的规定时间内，条目会被清除。"
                     update={this.updateAfterWrite}
                     value={config.expire_after_write}
                     unit={config.expire_after_write_unit || 'SECONDS'}
                     enabled={config.expire_after_write > 0}
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9" />
    </fieldset>);
  },
});

export default GuavaCacheFieldSet;
