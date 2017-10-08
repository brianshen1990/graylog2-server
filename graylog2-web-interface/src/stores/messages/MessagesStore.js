import Reflux from 'reflux';

import fetch from 'logic/rest/FetchProvider';
import MessageFormatter from 'logic/message/MessageFormatter';
import ApiRoutes from 'routing/ApiRoutes';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import StringUtils from 'util/StringUtils';

import ActionsProvider from 'injection/ActionsProvider';
const MessagesActions = ActionsProvider.getActions('Messages');

const MessagesStore = Reflux.createStore({
  listenables: [MessagesActions],
  sourceUrl: '',

  getInitialState() {
    return {};
  },

  loadMessage(index, messageId) {
    const url = ApiRoutes.MessagesController.single(index.trim(), messageId.trim()).url;
    const promise = fetch('GET', URLUtils.qualifyUrl(url))
      .then(
        response => MessageFormatter.formatResultMessage(response),
        (errorThrown) => {
          UserNotification.error(`导入消息信息失败: ${errorThrown}`,
            '无法导入消息信息');
        });

    MessagesActions.loadMessage.promise(promise);
  },

  fieldTerms(index, string) {
    const url = ApiRoutes.MessagesController.analyze(index, encodeURIComponent(StringUtils.stringify(string))).url;
    const promise = fetch('GET', URLUtils.qualifyUrl(url))
      .then(
        response => response.tokens,
        (error) => {
          UserNotification.error(`导入字段出错: ${error}`,
            '无法导入字段.');
        });

    MessagesActions.fieldTerms.promise(promise);
  },

  loadRawMessage(message, remoteAddress, codec, codecConfiguration) {
    const url = ApiRoutes.MessagesController.parse().url;
    const payload = {
      message: message,
      remote_address: remoteAddress,
      codec: codec,
      configuration: codecConfiguration,
    };

    const promise = fetch('POST', URLUtils.qualifyUrl(url), payload)
      .then(
        response => MessageFormatter.formatResultMessage(response),
        (error) => {
          if (error.additional && error.additional.status === 400) {
            UserNotification.error('请确保选择的解码器和配置正确. ' +
              '检查服务器日志以获取更多信息.', '无法导入原始消息');
            return;
          }
          UserNotification.error(`导入原始信息失败: ${error}`,
            '无法导入原始信息');
        });

    MessagesActions.loadRawMessage.promise(promise);
  },
});

export default MessagesStore;
