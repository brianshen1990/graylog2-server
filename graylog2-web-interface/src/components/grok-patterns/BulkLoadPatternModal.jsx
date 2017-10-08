import React from 'react';
import { Button } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const GrokPatternsStore = StoreProvider.getStore('GrokPatterns');

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';

const BulkLoadPatternModal = React.createClass({
  propTypes: {
    onSuccess: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      replacePatterns: false,
    };
  },

  _onSubmit(evt) {
    evt.preventDefault();

    const reader = new FileReader();

    reader.onload = (loaded) => {
      const request = loaded.target.result;
      GrokPatternsStore.bulkImport(request, this.state.replacePatterns).then(() => {
        UserNotification.success('Grok 模式导入成功！', 'Success!');
        this.refs.modal.close();
        this.props.onSuccess();
      });
    };

    reader.readAsText(this.refs['pattern-file'].getInputDOMNode().files[0]);
  },
  render() {
    return (
      <span>
        <Button bsStyle="info" style={{ marginRight: 5 }} onClick={() => this.refs.modal.open()}>导入模式文件</Button>

        <BootstrapModalForm ref="modal"
                              title="从文件中导入 Grok 模式"
                              submitButtonText="上传"
                              formProps={{ onSubmit: this._onSubmit }}>
          <Input type="file"
                   ref="pattern-file"
                   name="patterns"
                   label="模式文件"
                   help="文件包含 Grok 模式，每一行一个，名称和模式需要使用空格分开。"
                   required />
          <Input type="checkbox"
                   name="replace"
                   label="替换所有现存的模式?"
                   onChange={e => this.setState({ replacePatterns: e.target.checked })}
            />
        </BootstrapModalForm>
      </span>
    );
  },
});

export default BulkLoadPatternModal;
