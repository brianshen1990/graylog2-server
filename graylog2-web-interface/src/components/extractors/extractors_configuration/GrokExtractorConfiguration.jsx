import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Input } from 'components/bootstrap';
import Routes from 'routing/Routes';
import UserNotification from 'util/UserNotification';
import FormUtils from 'util/FormsUtils';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

const GrokExtractorConfiguration = React.createClass({
  propTypes: {
    configuration: PropTypes.object.isRequired,
    exampleMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onExtractorPreviewLoad: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      trying: false,
    };
  },
  _onChange(key) {
    return (event) => {
      this.props.onExtractorPreviewLoad(undefined);
      const newConfig = this.props.configuration;
      newConfig[key] = FormUtils.getValueFromInput(event.target);
      this.props.onChange(newConfig);
    };
  },
  _onTryClick() {
    this.setState({ trying: true });

    const promise = ToolsStore.testGrok(this.props.configuration.grok_pattern, this.props.configuration.named_captures_only, this.props.exampleMessage);
    promise.then((result) => {
      if (!result.matched) {
        UserNotification.warning('我们无法运行grok提取器。请检查您的参数。');
        return;
      }

      const matches = [];
      result.matches.map((match) => {
        matches.push(<dt key={`${match.name}-name`}>{match.name}</dt>);
        matches.push(<dd key={`${match.name}-value`}><samp>{match.match}</samp></dd>);
      });

      const preview = (matches.length === 0 ? '' : <dl>{matches}</dl>);
      this.props.onExtractorPreviewLoad(preview);
    });

    promise.finally(() => this.setState({ trying: false }));
  },
  _isTryButtonDisabled() {
    return this.state.trying || !this.props.configuration.grok_pattern || !this.props.exampleMessage;
  },
  render() {
    const helpMessage = (
      <span>
          用Grok 模式匹配当前字段，请使用 <b>{'%{PATTERN-NAME}'}</b> 尝试{' '}
        <LinkContainer to={Routes.SYSTEM.GROKPATTERNS}><a>已存储模式</a></LinkContainer>.
        </span>
    );

    return (
      <div>
        <Input type="checkbox"
               id="named_captures_only"
               label="只捕获指定名称"
               wrapperClassName="col-md-offset-2 col-md-10"
               defaultChecked={this.props.configuration.named_captures_only}
               onChange={this._onChange('named_captures_only')}
               help="只有指定名称才会被显式的捕获。" />

        <Input id="grok_pattern"
               label="Grok 模式"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help={helpMessage}>
          <Row className="row-sm">
            <Col md={11}>
              <input type="text" id="grok_pattern" className="form-control"
                     defaultValue={this.props.configuration.grok_pattern}
                     onChange={this._onChange('grok_pattern')}
                     required />
            </Col>
            <Col md={1} className="text-right">
              <Button bsStyle="info" onClick={this._onTryClick} disabled={this._isTryButtonDisabled()}>
                {this.state.trying ? <i className="fa fa-spin fa-spinner" /> : '试一试'}
              </Button>
            </Col>
          </Row>
        </Input>
      </div>
    );
  },
});

export default GrokExtractorConfiguration;
