import React, { PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Button } from 'react-bootstrap';

import BufferUsage from './BufferUsage';
import SystemOverviewDetails from './SystemOverviewDetails';
import JvmHeapUsage from './JvmHeapUsage';
import JournalDetails from './JournalDetails';
import SystemInformation from './SystemInformation';
import RestApiOverview from './RestApiOverview';
import PluginsDataTable from './PluginsDataTable';
import InputTypesDataTable from './InputTypesDataTable';

import Routes from 'routing/Routes';

const NodeOverview = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
    jvmInformation: PropTypes.object,
    plugins: PropTypes.array,
    inputDescriptions: PropTypes.object,
    inputStates: PropTypes.array,
  },
  render() {
    const node = this.props.node;
    const systemOverview = this.props.systemOverview;

    let pluginCount;
    if (this.props.plugins) {
      pluginCount = `${this.props.plugins.length} 个插件被安装在本节点上。`;
    }

    let inputCount;
    if (this.props.inputStates) {
      const runningInputs = this.props.inputStates.filter(inputState => inputState.state.toUpperCase() === 'RUNNING');
      inputCount = `${runningInputs.length} 个输入运行在本节点上`;
    }

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <SystemOverviewDetails node={node} information={systemOverview} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2 style={{ marginBottom: 5 }}>内存堆栈使用情况。</h2>
            <JvmHeapUsage nodeId={node.node_id} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>缓冲区</h2>
            <p className="description">
              缓冲区是为各个处理器提供的一小块超短时间存储少量消息的配置。
            </p>
            <Row>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输入缓冲" bufferType="input" />
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="处理缓冲" bufferType="process" />
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输出缓冲" bufferType="output" />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>磁盘日志</h2>
            <p className="description">
              输入消息会被写入到磁盘日志中以防止服务器出错。
            </p>
            <JournalDetails nodeId={node.node_id} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={6}>
            <h2>系统</h2>
            <SystemInformation node={node} systemInformation={systemOverview} jvmInformation={this.props.jvmInformation} />
          </Col>
          <Col md={6}>
            <h2>REST API</h2>
            <RestApiOverview node={node} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>已安装插件 <small>{pluginCount}</small></h2>
            <PluginsDataTable plugins={this.props.plugins} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <span className="pull-right">
              <LinkContainer to={Routes.node_inputs(node.node_id)}>
                <Button bsStyle="success" bsSize="small">管理输入</Button>
              </LinkContainer>
            </span>
            <h2 style={{ marginBottom: 15 }}>可用输入类型 <small>{inputCount}</small></h2>
            <InputTypesDataTable inputDescriptions={this.props.inputDescriptions} />
          </Col>
        </Row>
      </div>
    );
  },
});

export default NodeOverview;
