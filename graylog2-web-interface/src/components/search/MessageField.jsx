import React from 'react';

import { MessageFieldDescription } from 'components/search';

const MessageField = React.createClass({
  propTypes: {
    customFieldActions: React.PropTypes.node,
    disableFieldActions: React.PropTypes.bool,
    fieldName: React.PropTypes.string.isRequired,
    message: React.PropTypes.object.isRequired,
    possiblyHighlight: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
  },
  SPECIAL_FIELDS: ['full_message', 'level'],
  _isAdded(key) {
    const decorationStats = this.props.message.decoration_stats;
    return decorationStats && decorationStats.added_fields && decorationStats.added_fields[key] !== undefined;
  },
  _isChanged(key) {
    const decorationStats = this.props.message.decoration_stats;
    return decorationStats && decorationStats.changed_fields && decorationStats.changed_fields[key] !== undefined;
  },
  _isDecorated(key) {
    return this._isAdded(key) || this._isChanged(key);
  },
  render() {
    let pattern_mappings = {
      "action" : "措施",
      "ips_rule" : "入侵防御规则",
      "url_category1": "URL类别",
      "host_name": "主机名",
      "source_address" : "客户端地址",
      "destination_address": "服务器地址",
      "destination_port": "服务器端口",
      "protocol": "协议类型",
      "application_id": "应用",
      "rule_name": "规则名称",
      "type": "日志类别",
      "malware_name": "恶意软件名称",
      "source_port":"客户端端口",
      "log_time": "日志时间",
      "source_user": "用户",
      "application_attribute_id": "应用属性",
      "file_name": "文件名",
      "wrs_score": "WRS 评分",
      "host": "主机",
      "url": "URL",
      "url_category2": "URL类别2",
      "url_category3": "URL类别3",
      "url_category4": "URL类别4",
      "direction": "方向",
      "mail_sender":"发件人",
      "mail_recipient":"收件人",
      "mail_subject": "邮件主题"
    };
    let innerValue = this.props.value;
    const key = this.props.fieldName;
    if (this.SPECIAL_FIELDS.indexOf(key) !== -1) {
      innerValue = this.props.message.fields[key];
    }
    //var _get_un_show_list = function(){
    //  return ["z_vlt_01_message", "z_vlt_02_message", "z_vlt_03_message", "z_vlt_04_message","z_vlt_05_message"]
    //};
    if( key.indexOf("z_") == 0 ){
      return (
        <span></span>
      );
    }else {
      return (
        <span>
        <dt key={`${key}Title`}>{pattern_mappings[key] || key}</dt>
        <MessageFieldDescription key={`${key}Description`}
                                 message={this.props.message}
                                 fieldName={key}
                                 fieldValue={innerValue}
                                 possiblyHighlight={this.props.possiblyHighlight}
                                 disableFieldActions={this._isAdded(key) || this.props.disableFieldActions}
                                 customFieldActions={this.props.customFieldActions}
                                 isDecorated={this._isDecorated(key)}/>
      </span>
      );
    }
  },
});

export default MessageField;
