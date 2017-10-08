import Reflux from 'reflux';

import ActionsProvider from 'injection/ActionsProvider';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const AlarmCallbacksActions = ActionsProvider.getActions('AlarmCallbacks');

const AlarmCallbacksStore = Reflux.createStore({
  listenables: [AlarmCallbacksActions],

  list(streamId) {
    const failCallback = error =>
      UserNotification.error(`获取告警通知失败: ${error.message}`,
        '无法获取告警通知');

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.list(streamId).url);
    const promise = fetch('GET', url).then(response => response.alarmcallbacks, failCallback);

    AlarmCallbacksActions.list.promise(promise);
  },
  save(streamId, alarmCallback) {
    const failCallback = (error) => {
      const errorMessage = (error.additional && error.additional.status === 400 ? error.additional.body.message : error.message);
      UserNotification.error(`保存告警通知失败: ${errorMessage}`,
        '无法保存告警通知');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.create(streamId).url);

    const promise = fetch('POST', url, alarmCallback);
    promise.then(
      () => UserNotification.success('告警通知保存成功'),
      failCallback,
    );

    AlarmCallbacksActions.save.promise(promise);
  },
  delete(streamId, alarmCallbackId) {
    const failCallback = error =>
      UserNotification.error(`删除告警通知失败: ${error.message}`,
        '无法删除告警通知');

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.delete(streamId, alarmCallbackId).url);

    const promise = fetch('DELETE', url);
    promise.then(
      () => UserNotification.success('告警通知删除成功'),
      failCallback,
    );

    AlarmCallbacksActions.delete.promise(promise);
  },
  update(streamId, alarmCallbackId, deltas) {
    const failCallback = (error) => {
      const errorMessage = (error.additional && error.additional.status === 400 ? error.additional.body.message : error.message);
      UserNotification.error(`更新告警通知 '${alarmCallbackId}' 失败: ${errorMessage}`,
        '无法更新告警通知');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.update(streamId, alarmCallbackId).url);

    const promise = fetch('PUT', url, deltas);
    promise.then(
      () => UserNotification.success('告警通知更新成功'),
      failCallback,
    );

    AlarmCallbacksActions.update.promise(promise);
  },
});

export default AlarmCallbacksStore;
