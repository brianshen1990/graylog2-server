import React, { PropTypes } from 'react';
import Reflux from 'reflux';

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import ExportExtractors from 'components/extractors/ExportExtractors';

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const InputsStore = StoreProvider.getStore('Inputs');

const ExportExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputsStore)],
  getInitialState() {
    return {
      input: undefined,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
  },
  _isLoading() {
    return !this.state.input;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`导出提取器 ${this.state.input.title}`}>
        <div>
          <PageHeader title={<span>导出提取器 <em>{this.state.input.title}</em></span>}>
            <span>
              提取器可以被导出成JSON 并且被应用到其他的输入上。
            </span>
          </PageHeader>
          <ExportExtractors input={this.state.input} />
        </div>
      </DocumentTitle>
    );
  },
});

export default ExportExtractorsPage;
