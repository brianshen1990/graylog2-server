import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

import OutputsComponent from 'components/outputs/OutputsComponent';
import SupportLink from 'components/support/SupportLink';
import { DocumentTitle, Spinner } from 'components/common';
import Routes from 'routing/Routes';

const StreamOutputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  getInitialState() {
    return { stream: undefined };
  },
  componentDidMount() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({ stream: stream });
    });
  },
  render() {
    if (!this.state.stream) {
      return <Spinner />;
    }
    return (
      <DocumentTitle title={`数据流 ${this.state.stream.title}输出`}>
        <div>
          <Row className="content content-head">
            <Col md={10}>
              <h1>
                数据流 &raquo;{this.state.stream.title}&laquo输出;
              </h1>

              <p className="description">
                节点可以转发数据流消息到输出。在这里，可以开启或者结束任意的输出流。你可以为其他的应用再次使用这些数据流。

                所有配置的输出的全局概览在 <a href="@routes.OutputsController.index()">这里</a>可以查看.
              </p>

              <SupportLink>
                <i>删除</i> 输出会从数据流中删除该输出，但是它任然在输出列表中。
                删除一个全局的输出将会从全部的数据流中删除该输出并且停止。
                你可以查看所有的输出细节，在 {' '} <LinkContainer to={Routes.SYSTEM.OUTPUTS}><a>全局输出列表</a></LinkContainer>.
              </SupportLink>
            </Col>
          </Row>
          <OutputsComponent streamId={this.state.stream.id} permissions={this.state.currentUser.permissions} />
        </div>
      </DocumentTitle>
    );
  },
});

export default StreamOutputsPage;
