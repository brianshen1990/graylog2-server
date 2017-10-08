import React from 'react';

import { Panel } from 'react-bootstrap';
import naturalSort from 'javascript-natural-sort';
import { Input } from 'components/bootstrap';

const SidebarMessageField = React.createClass({
  propTypes: {
    field: React.PropTypes.object,
    fieldAnalyzers: React.PropTypes.array,
    onFieldAnalyzer: React.PropTypes.func,
    onToggled: React.PropTypes.func,
    selected: React.PropTypes.bool,
  },
  getInitialState() {
    return {
      showActions: false,
    };
  },

  componentDidMount() {
    this.style.use();
  },

  componentWillUnmount() {
    this.style.unuse();
  },

  style: require('!style/useable!css!./SidebarMessageField.css'),

  _onFieldAnalyzer(refId, fieldName) {
    return (event) => {
      event.preventDefault();
      this.props.onFieldAnalyzer(refId, fieldName);
    };
  },

  _fieldAnalyzersList() {
    const analyzersList = this.props.fieldAnalyzers
      .sort((a, b) => naturalSort(a.displayName, b.displayName))
      .map((analyzer, idx) => {
        return (
          <li key={`field-analyzer-button-${idx}`}>
            <a href="#" onClick={this._onFieldAnalyzer(analyzer.refId, this.props.field.name)}>
              {analyzer.displayName}
            </a>
          </li>
        );
      });

    return <Panel className="field-analyzer"><ul>{analyzersList}</ul></Panel>;
  },

  _toggleFieldAnalyzers(event) {
    event.preventDefault();
    this.setState({ showActions: !this.state.showActions });
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
    let toggleClassName = 'fa fa-fw open-analyze-field ';
    toggleClassName += this.state.showActions ? 'open-analyze-field-active fa-caret-down' : 'fa-caret-right';

    let fieldAnalyzers;
    if (this.state.showActions) {
      fieldAnalyzers = this._fieldAnalyzersList();
    }

    return (
      <li>
        <div className="pull-left">
          <a href="#" onClick={this._toggleFieldAnalyzers}><i className={toggleClassName} /></a>
        </div>
        <div className="field-selector">
          <Input type="checkbox"
                 label={ pattern_mappings[this.props.field.name] || this.props.field.name}
                 checked={this.props.selected}
                 onChange={() => this.props.onToggled(this.props.field.name)} />

          {fieldAnalyzers}
        </div>
      </li>
    );
  },
});

export default SidebarMessageField;
