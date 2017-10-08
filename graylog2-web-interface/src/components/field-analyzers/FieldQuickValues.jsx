import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import Reflux from 'reflux';

import QuickValuesVisualization from 'components/visualizations/QuickValuesVisualization';
import AddToDashboardMenu from 'components/dashboard/AddToDashboardMenu';
import Spinner from 'components/common/Spinner';
import UIUtils from 'util/UIUtils';

import StoreProvider from 'injection/StoreProvider';
const FieldQuickValuesStore = StoreProvider.getStore('FieldQuickValues');
const RefreshStore = StoreProvider.getStore('Refresh');

const FieldQuickValues = React.createClass({
  propTypes: {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    query: React.PropTypes.string.isRequired,
    rangeType: React.PropTypes.string.isRequired,
    rangeParams: React.PropTypes.object.isRequired,
    stream: PropTypes.object,
    forceFetch: React.PropTypes.bool,
  },
  mixins: [Reflux.listenTo(RefreshStore, '_setupTimer', '_setupTimer')],
  getInitialState() {
    return {
      field: undefined,
      data: [],
    };
  },

  componentDidMount() {
    this._loadQuickValuesData();
  },
  componentWillReceiveProps(nextProps) {
    // Reload values when executed search changes
    if (this.props.query !== nextProps.query ||
        this.props.rangeType !== nextProps.rangeType ||
        JSON.stringify(this.props.rangeParams) !== JSON.stringify(nextProps.rangeParams) ||
        this.props.stream !== nextProps.stream ||
        nextProps.forceFetch) {
      this._loadQuickValuesData();
    }
  },
  componentDidUpdate(oldProps, oldState) {
    if (this.state.field !== oldState.field) {
      const element = ReactDOM.findDOMNode(this);
      UIUtils.scrollToHint(element);
    }
  },
  componentWillUnmount() {
    this._stopTimer();
  },

  WIDGET_TYPE: 'QUICKVALUES',

  _setupTimer(refresh) {
    this._stopTimer();
    if (refresh.enabled) {
      this.timer = setInterval(this._loadQuickValuesData, refresh.interval);
    }
  },
  _stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  addField(field) {
    this.setState({ field: field }, () => this._loadQuickValuesData(false));
  },
  _loadQuickValuesData() {
    if (this.state.field !== undefined) {
      this.setState({ loadPending: true });
      const promise = FieldQuickValuesStore.getQuickValues(this.state.field);
      promise.then(data => this.setState({ data: data, loadPending: false }));
    }
  },
  _resetStatus() {
    this.setState(this.getInitialState());
  },
  render() {
    let content;
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
    let inner;
    if (this.state.data.length === 0) {
      inner = <Spinner />;
    } else {
      inner = (
        <QuickValuesVisualization id={this.state.field}
                                  config={{ show_pie_chart: true, show_data_table: true }}
                                  data={this.state.data}
                                  horizontal
                                  displayAddToSearchButton
                                  displayAnalysisInformation />
      );
    }

    if (this.state.field !== undefined) {
      content = (
        <div className="content-col">
          <div className="pull-right">
            <AddToDashboardMenu title="添加到面板"
                                widgetType={this.WIDGET_TYPE}
                                configuration={{ field: this.state.field }}
                                bsStyle="default"
                                pullRight
                                permissions={this.props.permissions}>
              <Button bsSize="small" onClick={() => this._resetStatus()}>删除</Button>
            </AddToDashboardMenu>
          </div>
          <h1>快速统计值 - {pattern_mappings[this.state.field] || this.state.field} {this.state.loadPending && <i
            className="fa fa-spin fa-spinner" />}</h1>

          <div style={{ maxHeight: 400, overflow: 'auto', marginTop: 10 }}>{inner}</div>
        </div>
      );
    }
    return <div id="field-quick-values">{content}</div>;
  },
});

export default FieldQuickValues;
