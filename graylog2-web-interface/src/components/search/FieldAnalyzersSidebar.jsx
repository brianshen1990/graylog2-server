import React from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'components/bootstrap';

import { DecoratedSidebarMessageField, SidebarMessageField } from 'components/search';

const FieldAnalyzersSidebar = React.createClass({
  propTypes: {
    fields: React.PropTypes.array,
    fieldAnalyzers: React.PropTypes.array,
    onFieldAnalyzer: React.PropTypes.func,
    onFieldToggled: React.PropTypes.func,
    maximumHeight: React.PropTypes.number,
    predefinedFieldSelection: React.PropTypes.func,
    result: React.PropTypes.object,
    selectedFields: React.PropTypes.object,
    shouldHighlight: React.PropTypes.bool,
    showAllFields: React.PropTypes.bool,
    showHighlightToggle: React.PropTypes.bool,
    togglePageFields: React.PropTypes.func,
    toggleShouldHighlight: React.PropTypes.func,
  },

  getInitialState() {
    return {
      fieldFilter: '',
      maxFieldsHeight: 1000,
    };
  },

  componentDidMount() {
    this._updateHeight();
    window.addEventListener('scroll', this._updateHeight);
  },

  componentDidUpdate(prevProps) {
    if (this.props.showAllFields !== prevProps.showAllFields || this.props.maximumHeight !== prevProps.maximumHeight) {
      this._updateHeight();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this._updateHeight);
  },

  MINIMUM_FIELDS_HEIGHT: 50,

  _updateHeight() {
    const fieldsContainer = ReactDOM.findDOMNode(this.refs.fields);

    const footer = ReactDOM.findDOMNode(this.refs.footer);
    const footerCss = window.getComputedStyle(footer);
    const footerMargin = parseFloat(footerCss.getPropertyValue('margin-top'));

    // Need to calculate this additionally, because margins are not included in the parent's height #computers
    let highlightToggleMargins = 0;
    if (this.refs.highlightToggle) {
      const toggle = ReactDOM.findDOMNode(this.refs.highlightToggle);
      const toggleCss = window.getComputedStyle(toggle);
      highlightToggleMargins = parseFloat(toggleCss.getPropertyValue('margin-top')) +
        parseFloat(toggleCss.getPropertyValue('margin-bottom'));
    }

    const maxHeight = this.props.maximumHeight -
      fieldsContainer.getBoundingClientRect().top -
      footerMargin -
      footer.offsetHeight -
      highlightToggleMargins;

    this.setState({ maxFieldsHeight: Math.max(maxHeight, this.MINIMUM_FIELDS_HEIGHT) });
  },

  _filterFields(event) {
    this.setState({ fieldFilter: event.target.value });
  },

  _showAllFields(event) {
    event.preventDefault();
    if (!this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },
  _showPageFields(event) {
    event.preventDefault();
    if (this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },

  _updateFieldSelection(setName) {
    this.props.predefinedFieldSelection(setName);
  },
  _updateFieldSelectionToDefault() {
    this._updateFieldSelection('default');
  },
  _updateFieldSelectionToAll() {
    this._updateFieldSelection('all');
  },
  _updateFieldSelectionToNone() {
    this._updateFieldSelection('none');
  },

  render() {
    var _get_show_list_in_order = function(){
      return ["host_name", "source_address", "destination_address", "destination_port", "action",
          "ips_rule", "application_id", "type", "malware_name", "source_port"]
    };

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
    const decorationStats = this.props.result.decoration_stats;
    const decoratedFields = decorationStats ? [].concat(decorationStats.added_fields || [], decorationStats.changed_fields || []) : [];
    var messageFields = this.props.fields
      .filter(field => {
        if( field.name.indexOf(this.state.fieldFilter) !== -1 ){
          return true;
        }
        if( pattern_mappings[field.name] && pattern_mappings[field.name].indexOf(this.state.fieldFilter) !== -1 ){
          return true;
        }
        return false;
      })
      .filter(field => {
        return field.name.indexOf("z_") != 0;
      })
      .sort((a, b) => {
        var field1 = a.name.toLowerCase();
        var field2 = b.name.toLowerCase();
        try {
          if (_get_show_list_in_order().indexOf(field1)>=0 && _get_show_list_in_order().indexOf(field2)<0) {
            return -1;
          }
          if (_get_show_list_in_order().indexOf(field1)<0 && _get_show_list_in_order().indexOf(field2)>=0) {
            return 1;
          }
          if (_get_show_list_in_order().indexOf(field1)<0 && _get_show_list_in_order().indexOf(field2)<0) {
            var ret =  field1.toLowerCase().localeCompare(field2.toLowerCase());
            return ret;
          }
          if (_get_show_list_in_order().indexOf(field1)>=0 && _get_show_list_in_order().indexOf(field2)>=0) {
            var ret =( ( _get_show_list_in_order().indexOf(field1) > _get_show_list_in_order().indexOf(field2) ) ? 1:-1 );
            return ret;
          }
        }catch(e){
          console.log("error 1" + e);
          return field1.localeCompare(field2)
        }
      });
    messageFields = messageFields
      .map((field) => {
        let messageField;
        if (decoratedFields.includes(field.name)) {
          messageField = (
            <DecoratedSidebarMessageField key={field.name}
                                          field={field}
                                          onToggled={this.props.onFieldToggled}
                                          selected={this.props.selectedFields.contains(field.name)} />
          );
        } else {
          messageField = (
            <SidebarMessageField key={field.name}
                                 field={field}
                                 fieldAnalyzers={this.props.fieldAnalyzers}
                                 onToggled={this.props.onFieldToggled}
                                 onFieldAnalyzer={this.props.onFieldAnalyzer}
                                 selected={this.props.selectedFields.contains(field.name)} />
          );
        }
        return messageField;
      });

    let shouldHighlightToggle;
    if (this.props.showHighlightToggle) {
      shouldHighlightToggle = (
        <Input ref="highlightToggle" type="checkbox" bsSize="small" checked={this.props.shouldHighlight}
               onChange={this.props.toggleShouldHighlight} label="高亮结果"
               groupClassName="result-highlight-control" />
      );
    }

    return (
      <div>
        <div ref="fieldsFilter" className="input-group input-group-sm" style={{ marginTop: 5, marginBottom: 5 }}>
          <span className="input-group-btn">
            <button type="button" className="btn btn-default"
                    onClick={this._updateFieldSelectionToDefault}>默认
            </button>
            <button type="button" className="btn btn-default"
                    onClick={this._updateFieldSelectionToAll}>全部
            </button>
            <button type="button" className="btn btn-default"
                    onClick={this._updateFieldSelectionToNone}>无
            </button>
          </span>
          <input type="text" className="form-control" placeholder="筛选字段"
                 onChange={this._filterFields}
                 value={this.state.fieldFilter} />
        </div>
        <div ref="fields" style={{ maxHeight: this.state.maxFieldsHeight, overflowY: 'scroll' }}>
          <ul className="search-result-fields">
            {messageFields}
          </ul>
        </div>
        <div ref="footer" style={{ marginTop: 13, marginBottom: 0 }}>
          列出{' '}
          <span className="message-result-fields-range"> &nbsp;
            <a href="#" style={{ fontWeight: this.props.showAllFields ? 'normal' : 'bold' }}
               onClick={this._showPageFields}>本页</a> 字段 或者{' '}
            <a href="#" style={{ fontWeight: this.props.showAllFields ? 'bold' : 'normal' }}
               onClick={this._showAllFields}>全部字段</a>.
          </span>
          <br />
          {shouldHighlightToggle}
        </div>
      </div>
    );
  },
});

export default FieldAnalyzersSidebar;
