import React, { PropTypes } from 'react';
import Reflux from 'reflux';

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import ImportExtractors from 'components/extractors/ImportExtractors';

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const InputsStore = StoreProvider.getStore('Inputs');

const ImportExtractorsPage = React.createClass({
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
    InputsActions.get.triggerPromise(this.props.params.inputId).then(input => this.setState({ input: input }));
  },
  _isLoading() {
    return !this.state.input;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`导提取器到 ${this.state.input.title}`}>
        <div>
          <PageHeader title={<span>导入提取器到 <em>{this.state.input.title}</em></span>}>
            <span>
              导出的提取器可以被导入到一个输入。你所需的就是一份JSON导出。
            </span>
          </PageHeader>
          <ImportExtractors input={this.state.input} />
        </div>
      </DocumentTitle>
    );
  },
});

export default ImportExtractorsPage;
