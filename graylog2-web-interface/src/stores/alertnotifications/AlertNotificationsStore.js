import Reflux from 'reflux';

import ActionsProvider from 'injection/ActionsProvider';
const AlertNotificationsActions = ActionsProvider.getActions('AlertNotifications');

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const AlertNotificationsStore = Reflux.createStore({
  listenables: [AlertNotificationsActions],
  availableNotifications: undefined,
  allNotifications: undefined,

  getInitialState() {
    return {
      availableNotifications: this.availableNotifications,
      allNotifications: this.allNotifications,
    };
  },

  available() {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.available().url);
    const promise = fetch('GET', url);
    promise
      .then(
        (response) => {
          this.availableNotifications = response.types;
          this.trigger({ availableNotifications: this.availableNotifications });
          return this.availableNotifications;
        },
        (error) => {
          UserNotification.error(`获取可用告警通知失败: ${error.message}`,
            '无法获取可用告警通知');
        });

    AlertNotificationsActions.available.promise(promise);
  },

  listAll() {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.listAll().url);
    const promise = fetch('GET', url);
    promise.then(
      (response) => {
        this.allNotifications = response.alarmcallbacks;
        this.trigger({ allNotifications: this.allNotifications });
        return this.allNotifications;
      },
      (error) => {
        UserNotification.error(`获取告警通知失败: ${error.message}`,
          '无法获取告警通知');
      });

    AlertNotificationsActions.listAll.promise(promise);
  },

  testAlert(alarmCallbackId) {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.testAlert(alarmCallbackId).url);

    const promise = fetch('POST', url);
    promise.then(
      () => UserNotification.success('测试通知发送成功'),
      (error) => {
        const message = (error.additional && error.additional.body && error.additional.body.message ? error.additional.body.message : error.message);
        UserNotification.error(`发送测试告警通知失败: ${message}`,
          '无法发送测试告警通知');
      },
    );

    AlertNotificationsActions.testAlert.promise(promise);

    // Need to do this to handle possible concurrent calls to this method
    return promise;
  },
});

export default AlertNotificationsStore;
