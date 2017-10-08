import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const SystemLoadBalancerStore = Reflux.createStore({
  sourceUrl: nodeId => `/cluster/${nodeId}/lbstatus`,

  override(nodeId, status) {
    return fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/override/${status}`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`成功导入负载均衡状态，更新至 '${status}' 在节点 '${nodeId}'`);
        },
        (error) => {
          UserNotification.error(`在节点 '${nodeId}' 更新负载均衡状态失败: ${error}`,
            `无法更新负载均衡状态至 '${status}' ，在节点 '${nodeId}'`);
        },
      );
  },
});

export default SystemLoadBalancerStore;
