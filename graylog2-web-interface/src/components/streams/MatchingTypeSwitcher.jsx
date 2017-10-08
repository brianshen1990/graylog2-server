import React from 'react';
import { PropTypes, Component } from 'react';
import { Input } from 'components/bootstrap';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');

import UserNotification from 'util/UserNotification';

class MatchingTypeSwitcher extends Component {
  static propTypes = {
    stream: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="streamrule-connector-type-form">
        <div>
          <Input type="radio" label="消息需满足全部规则"
                 checked={this.props.stream.matching_type === 'AND'} onChange={this.handleTypeChangeToAnd.bind(this)} />
          <Input type="radio" label="消息需满意任一规则"
                 checked={this.props.stream.matching_type === 'OR'} onChange={this.handleTypeChangeToOr.bind(this)} />
        </div>
      </div>
    );
  }

  handleTypeChangeToAnd() {
    this.handleTypeChange('AND');
  }

  handleTypeChangeToOr() {
    this.handleTypeChange('OR');
  }

  handleTypeChange(newValue) {
    if (window.confirm('即将更新数据流规则，是否继续? 更改会立马生效.')) {
      StreamsStore.update(this.props.stream.id, { matching_type: newValue }, (response) => {
        this.props.onChange();
        UserNotification.success(`消息将被路由到数据流，当 ${newValue === 'AND' ? '全部' : '任何'} 规则匹配`,
          '成功');
        return response;
      });
    }
  }
}

export default MatchingTypeSwitcher;
