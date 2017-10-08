import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const SystemMessagesStore = StoreProvider.getStore('SystemMessages');

import { Spinner } from 'components/common';
import { SystemMessagesList } from 'components/systemmessages';

const SystemMessagesComponent = React.createClass({
  getInitialState() {
    return { currentPage: 1 };
  },
  componentDidMount() {
    this.loadMessages(this.state.currentPage);
    this.interval = setInterval(() => { this.loadMessages(this.state.currentPage); }, 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  PER_PAGE: 30,
  loadMessages(page) {
    SystemMessagesStore.all(page).then((response) => {
      this.setState(response);
    });
  },
  _onSelected(selectedPage) {
    this.setState({ currentPage: selectedPage });
    this.loadMessages(selectedPage);
  },
  render() {
    let content;
    if (this.state.total && this.state.messages) {
      const numberPages = Math.ceil(this.state.total / this.PER_PAGE);
      const paginatorSize = 10;

      content = (
        <div>
          <SystemMessagesList messages={this.state.messages} />

          <nav style={{ textAlign: 'center' }}>
            <Pagination bsSize="small" items={numberPages}
                        activePage={this.state.currentPage}
                        onSelect={this._onSelected}
                        prev next first last
                        maxButtons={Math.min(paginatorSize, numberPages)} />
          </nav>
        </div>
      );
    } else {
      content = <Spinner />;
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2>系统消息</h2>

          <p className="description">
            系统消息是xxxx 日志平台产生的日志。无需在此处理信息，需要处理的信息会显示在通知栏中。
          </p>

          {content}
        </Col>
      </Row>
    );
  },
});

export default SystemMessagesComponent;
