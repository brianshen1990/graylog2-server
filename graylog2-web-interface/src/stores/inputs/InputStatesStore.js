import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const InputStatesStore = Reflux.createStore({
  listenables: [],

  init() {
    this.list();
  },

  getInitialState() {
    return { inputStates: this.inputStates };
  },

  list() {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.list().url);
    return fetch('GET', url)
      .then((response) => {
        const result = {};
        Object.keys(response).forEach((node) => {
          if (!response[node]) {
            return;
          }
          response[node].forEach((input) => {
            if (!result[input.id]) {
              result[input.id] = {};
            }
            result[input.id][node] = input;
          });
        });
        this.inputStates = result;
        this.trigger({ inputStates: this.inputStates });

        return result;
      });
  },

  _checkInputStateChangeResponse(input, response, action) {
    const nodes = Object.keys(response).filter(node => input.global ? true : node === input.node);
    const failedNodes = nodes.filter(nodeId => response[nodeId] === null);

    if (failedNodes.length === 0) {
      UserNotification.success(`请求 ${action.toLowerCase()} 至输入 '${input.title}' 发送成功.`,
        `输入 '${input.title}' 即将 ${action === 'START' ? '开始' : '停止'} `);
    } else if (failedNodes.length === nodes.length) {
      UserNotification.error(`请求 ${action.toLowerCase()} 至输入 '${input.title}' 失败.`,
        `输入 '${input.title}' 无法 ${action === 'START' ? '开始' : '停止'}`);
    } else {
      UserNotification.warning(`请求 ${action.toLowerCase()} 至输入 '${input.title}' 失败.`,
        `输入 '${input.title}' 无法 ${action === 'START' ? '开始' : '停止'}`);
    }
  },

  start(input) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.start(input.id).url);
    return fetch('PUT', url)
      .then(
        (response) => {
          this._checkInputStateChangeResponse(input, response, 'START');
          this.list();
          return response;
        },
        (error) => {
          UserNotification.error(`启动输入 '${input.title}'失败: ${error}`, `输入 '${input.title}' 无法启动`);
        });
  },

  stop(input) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.stop(input.id).url);
    return fetch('DELETE', url)
      .then(
        (response) => {
          this._checkInputStateChangeResponse(input, response, 'STOP');
          this.list();
          return response;
        },
        (error) => {
          UserNotification.error(`停止输入 '${input.title}'失败: ${error}`, `输入 '${input.title}' 无法停止`);
        });
  },
});

export default InputStatesStore;
