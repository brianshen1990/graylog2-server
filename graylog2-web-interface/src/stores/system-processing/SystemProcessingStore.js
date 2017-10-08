import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const SystemProcessingStore = Reflux.createStore({
  sourceUrl: nodeId => `/cluster/${nodeId}/processing`,

  pause(nodeId) {
    return fetch('POST', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/pause`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`在节点 '${nodeId}'暂停消息处理程序成功`);
        },
        (error) => {
          UserNotification.error(`在节点 '${nodeId}' 暂停消息处理程序失败: ${error}`,
            ` 无法在节点'${nodeId}'暂停消息处理程序`);
        },
      );
  },

  resume(nodeId) {
    return fetch('POST', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/resume`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`在节点 '${nodeId}'恢复消息处理程序成功`);
        },
        (error) => {
          UserNotification.error(`在节点 '${nodeId}'恢复消息处理程序失败: ${error}`,
            `无法在节点 '${nodeId}'恢复消息处理程序`);
        },
      );
  },
});

export default SystemProcessingStore;
