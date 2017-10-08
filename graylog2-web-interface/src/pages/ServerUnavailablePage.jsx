import React from 'react';
import { Modal, Well } from 'react-bootstrap';
import { DocumentTitle } from 'components/common';

import URLUtils from 'util/URLUtils';

import disconnectedStyle from '!style/useable!css!less!stylesheets/disconnected.less';

const ServerUnavailablePage = React.createClass({
  propTypes: {
    server: React.PropTypes.object,
  },

  getInitialState() {
    return {
      showDetails: false,
    };
  },

  componentDidMount() {
    disconnectedStyle.use();
  },

  componentWillUnmount() {
    disconnectedStyle.unuse();
  },

  _toggleDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  },

  _formatErrorMessage() {
    if (!this.state.showDetails) {
      return null;
    }

    const noInformationMessage = (
      <div>
        <hr />
        <p>There is no information available.</p>
      </div>
    );

    if (!this.props.server || !this.props.server.error) {
      return noInformationMessage;
    }

    const error = this.props.server.error;

    const errorDetails = [];
    if (error.message) {
      errorDetails.push(<dt key="error-title">Error message</dt>, <dd key="error-desc">{error.message}</dd>);
    }
    if (error.originalError) {
      const originalError = error.originalError;
      errorDetails.push(
        <dt key="status-original-request-title">Original Request</dt>,
        <dd key="status-original-request-content">{String(originalError.method)} {String(originalError.url)}</dd>,
      );
      errorDetails.push(
        <dt key="status-code-title">Status code</dt>,
        <dd key="status-code-desc">{String(originalError.status)}</dd>,
      );

      if (typeof originalError.toString === 'function') {
        errorDetails.push(
          <dt key="full-error-title">Full error message</dt>,
          <dd key="full-error-desc">{originalError.toString()}</dd>,
        );
      }
    }

    if (errorDetails.length === 0) {
      return noInformationMessage;
    }

    return (
      <div>
        <hr style={{ marginTop: 10, marginBottom: 10 }} />
        <p>This is the last response we received from the server:</p>
        <Well bsSize="small" style={{ whiteSpace: 'pre-line' }}>
          <dl style={{ marginBottom: 0 }}>
            {errorDetails}
          </dl>
        </Well>
      </div>
    );
  },

  render() {
    return (
      <DocumentTitle title="服务器不可达">
        <Modal show>
          <Modal.Header>
            <Modal.Title><i className="fa fa-exclamation-triangle" /> 服务器暂时不可达</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>
                目前服务器连接存在问题： <i>{URLUtils.qualifyUrl('')}</i>。
                请检查服务器是否正常工作。
              </p>
              <p>服务器恢复后，会自动跳转到先前页面。</p>
              <div>
                <a href="#" onClick={this._toggleDetails}>
                  {this.state.showDetails ? '简短信息' : '更多细节'}
                </a>
                {this._formatErrorMessage()}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </DocumentTitle>
    );
  },
});

export default ServerUnavailablePage;
