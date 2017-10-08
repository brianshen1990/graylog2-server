import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Input } from 'components/bootstrap';
import { Select, Spinner } from 'components/common';
import Routes from 'routing/Routes';
import UserNotification from 'util/UserNotification';
import FormUtils from 'util/FormsUtils';
import StoreProvider from 'injection/StoreProvider';
import CombinedProvider from 'injection/CombinedProvider';

const ToolsStore = StoreProvider.getStore('Tools');
const { LookupTablesActions } = CombinedProvider.get('LookupTables');

const LookupTableExtractorConfiguration = React.createClass({
  propTypes: {
    configuration: PropTypes.object.isRequired,
    exampleMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onExtractorPreviewLoad: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      exampleMessage: '',
    };
  },

  getInitialState() {
    return {
      trying: false,
      lookupTables: undefined,
    };
  },

  componentDidMount() {
    // TODO the 10k items is bad. we need a searchable/scrollable long list select box
    LookupTablesActions.searchPaginated(1, 10000, null).then((result) => {
      this.setState({ lookupTables: result.lookup_tables });
    });
  },

  _updateConfigValue(key, value) {
    this.props.onExtractorPreviewLoad(undefined);
    const newConfig = this.props.configuration;
    newConfig[key] = value;
    this.props.onChange(newConfig);
  },

  _onChange(key) {
    return event => this._updateConfigValue(key, FormUtils.getValueFromInput(event.target));
  },

  _onSelect(key) {
    return value => this._updateConfigValue(key, value);
  },

  _onTryClick() {
    this.setState({ trying: true });

    const promise = ToolsStore.testLookupTable(this.props.configuration.lookup_table_name, this.props.exampleMessage);
    promise.then((result) => {
      if (result.error) {
        UserNotification.warning(`无法运行查找: ${result.error_message}`);
        return;
      }

      if (!result.empty) {
        this.props.onExtractorPreviewLoad(result.value);
      } else {
        this.props.onExtractorPreviewLoad(`没有查找结果 "${result.key}"`);
      }
    });

    promise.finally(() => this.setState({ trying: false }));
  },

  _isTryButtonDisabled() {
    return this.state.trying || !this.props.configuration.lookup_table_name || !this.props.exampleMessage;
  },

  render() {
    if (!this.state.lookupTables) {
      return <Spinner />;
    }

    const lookupTables = this.state.lookupTables.map((table) => {
      return { label: table.title, value: table.name };
    });

    const helpMessage = (
      <span>
        查找表可以在 <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.OVERVIEW}><a>这里</a></LinkContainer>创建.
      </span>
    );

    return (
      <div>
        <Input id="lookup_table_name"
               label="查找表"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help={helpMessage}>
          <Row className="row-sm">
            <Col md={11}>
              <Select placeholder="选择一个查找表"
                      clearable={false}
                      options={lookupTables}
                      matchProp="value"
                      onValueChange={this._onSelect('lookup_table_name')}
                      value={this.props.configuration.lookup_table_name} />
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

export default LookupTableExtractorConfiguration;
