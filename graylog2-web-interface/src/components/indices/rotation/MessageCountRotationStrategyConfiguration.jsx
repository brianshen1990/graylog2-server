import React from 'react';
import { Input } from 'components/bootstrap';

const MessageCountRotationStrategyConfiguration = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    jsonSchema: React.PropTypes.object.isRequired,
    updateConfig: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      max_docs_per_index: this.props.config.max_docs_per_index,
    };
  },

  _onInputUpdate(field) {
    return (e) => {
      const update = {};
      update[field] = e.target.value;

      this.setState(update);
      this.props.updateConfig(update);
    };
  },

  render() {
    return (
      <div>
        <fieldset>

          <Input type="number"
                 id="max-docs-per-index"
                 label="索引最大文件数"
                 onChange={this._onInputUpdate('max_docs_per_index')}
                 value={this.state.max_docs_per_index}
                 help="索引的最大文件数目"
                 required />
        </fieldset>
      </div>
    );
  },
});

export default MessageCountRotationStrategyConfiguration;
