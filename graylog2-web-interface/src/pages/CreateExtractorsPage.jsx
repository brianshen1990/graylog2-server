import React, { PropTypes } from 'react';
import Reflux from 'reflux';

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import EditExtractor from 'components/extractors/EditExtractor';

import DocsHelper from 'util/DocsHelper';
import StringUtils from 'util/StringUtils';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const ExtractorsStore = StoreProvider.getStore('Extractors');
const InputsStore = StoreProvider.getStore('Inputs');
// eslint-disable-next-line no-unused-vars
const MessagesStore = StoreProvider.getStore('Messages');

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');
const MessagesActions = ActionsProvider.getActions('Messages');

const CreateExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputsStore)],
  getInitialState() {
    const { query } = this.props.location;

    return {
      extractor: ExtractorsStore.new(query.extractor_type, query.field),
      input: undefined,
      exampleMessage: undefined,
      extractorType: query.extractor_type,
      field: query.field,
      exampleIndex: query.example_index,
      exampleId: query.example_id,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
    MessagesActions.loadMessage.triggerPromise(this.state.exampleIndex, this.state.exampleId)
      .then(message => this.setState({ exampleMessage: message }));
  },
  _isLoading() {
    return !(this.state.input && this.state.exampleMessage);
  },
  _extractorSaved() {
    let url;
    if (this.state.input.global) {
      url = Routes.global_input_extractors(this.props.params.inputId);
    } else {
      url = Routes.local_input_extractors(this.props.params.nodeId, this.props.params.inputId);
    }

    this.props.history.pushState(null, url);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const exampleMessage = StringUtils.stringify(this.state.exampleMessage.fields[this.state.field]);

    return (
      <DocumentTitle title={`为输入 ${this.state.input.title} 提取器`}>
        <div>
          <PageHeader title={<span>为输入 <em>{this.state.input.title}</em> 创建提取器 </span>}>
            <span>
              提取器 会被应用到该输入的每一条消息。使用它们去抽取并且创建新的字段，以便您后续过滤和解析。
            </span>

          </PageHeader>
          <EditExtractor action="create"
                         extractor={this.state.extractor}
                         inputId={this.state.input.id}
                         exampleMessage={exampleMessage}
                         onSave={this._extractorSaved} />
        </div>
      </DocumentTitle>
    );
  },
});

export default CreateExtractorsPage;
