import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

import { Spinner } from 'components/common';
import { AddDecoratorButton, Decorator, DecoratorList } from 'components/search';
import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';
import PermissionsMixin from 'util/PermissionsMixin';

import StoreProvider from 'injection/StoreProvider';
const DecoratorsStore = StoreProvider.getStore('Decorators');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

import ActionsProvider from 'injection/ActionsProvider';
const DecoratorsActions = ActionsProvider.getActions('Decorators');

import DecoratorStyles from '!style!css!components/search/decoratorStyles.css';

const DecoratorSidebar = React.createClass({
  propTypes: {
    stream: React.PropTypes.string,
    maximumHeight: React.PropTypes.number,
  },
  mixins: [Reflux.connect(DecoratorsStore), Reflux.connect(CurrentUserStore), PermissionsMixin],
  getInitialState() {
    return {
      maxDecoratorsHeight: 1000,
    };
  },

  componentDidMount() {
    this._updateHeight();
    window.addEventListener('scroll', this._updateHeight);
  },

  componentDidUpdate(prevProps) {
    if (this.props.maximumHeight !== prevProps.maximumHeight) {
      this._updateHeight();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this._updateHeight);
  },

  MINIMUM_DECORATORS_HEIGHT: 50,

  _updateHeight() {
    const decoratorsContainer = ReactDOM.findDOMNode(this.refs.decoratorsContainer);
    const maxHeight = this.props.maximumHeight - decoratorsContainer.getBoundingClientRect().top;

    this.setState({ maxDecoratorsHeight: Math.max(maxHeight, this.MINIMUM_DECORATORS_HEIGHT) });
  },

  _formatDecorator(decorator) {
    const typeDefinition = this.state.types[decorator.type] || { requested_configuration: {}, name: `Unknown type: ${decorator.type}` };
    return ({ id: decorator.id,
      title: <Decorator key={`decorator-${decorator.id}`}
                                                   decorator={decorator}
                                                   typeDefinition={typeDefinition} /> });
  },
  _updateOrder(decorators) {
    decorators.forEach((item, idx) => {
      const decorator = this.state.decorators.find(i => i.id === item.id);
      decorator.order = idx;
      DecoratorsActions.update(decorator.id, decorator);
    });
  },
  render() {
    if (!this.state.decorators) {
      return <Spinner />;
    }
    const decorators = this.state.decorators
      .filter(decorator => (this.props.stream ? decorator.stream === this.props.stream : !decorator.stream))
      .sort((d1, d2) => d1.order - d2.order);
    const nextDecoratorOrder = decorators.length > 0 ? decorators[decorators.length - 1].order + 1 : 0;
    const decoratorItems = decorators.map(this._formatDecorator);
    const popoverHelp = (
      <Popover id="decorators-help" className={DecoratorStyles.helpPopover}>
        <p className="description">
          装饰器可以修改搜索结果. 这些改变不会被存储, 只会在搜索结果中应用. 装饰器配置单位是 <strong>每个数据流</strong>.
        </p>
        <p className="description">
          使用拖放的方式去选择哪些装饰器需要被执行.
        </p>
      </Popover>
    );

    const editPermissions = this.isPermitted(this.state.currentUser.permissions, `decorators:edit:${this.props.stream}`);
    return (
      <div>
        <AddDecoratorButton stream={this.props.stream} nextOrder={nextDecoratorOrder} disabled={!editPermissions} />
        <div ref="decoratorsContainer" className={DecoratorStyles.decoratorListContainer} style={{ maxHeight: this.state.maxDecoratorsHeight }}>
          <DecoratorList decorators={decoratorItems} onReorder={this._updateOrder} disableDragging={!editPermissions} />
        </div>
      </div>
    );
  },
});

export default DecoratorSidebar;
