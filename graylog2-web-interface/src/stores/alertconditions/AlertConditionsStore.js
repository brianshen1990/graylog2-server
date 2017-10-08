import Reflux from 'reflux';
import _ from 'lodash';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';
const AlertConditionsActions = ActionsProvider.getActions('AlertConditions');

const AlertConditionsStore = Reflux.createStore({
  listenables: AlertConditionsActions,

  init() {
    this.available();
  },

  getInitialState() {
    return {
      types: this.types,
      allAlertConditions: this.allAlertConditions,
    };
  },

  available() {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlertConditionsApiController.available().url);
    const promise = fetch('GET', url).then((response) => {
      this.types = response;
      this.trigger(this.getInitialState());
    });

    AlertConditionsActions.available.promise(promise);
    return promise;
  },

  delete(streamId, alertConditionId) {
    const failCallback = (error) => {
      UserNotification.error(`删除告警条件失败: ${error}`,
        '无法删除告警条件');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.delete(streamId, alertConditionId).url);
    const promise = fetch('DELETE', url).then(() => {
      AlertConditionsActions.listAll();
      UserNotification.success('告警条件删除成功');
    }, failCallback);
    AlertConditionsActions.delete.promise(promise);
    return promise;
  },

  listAll() {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlertConditionsApiController.list().url);
    const promise = fetch('GET', url).then(
      (response) => {
        this.allAlertConditions = response.conditions;
        this.trigger({ allAlertConditions: this.allAlertConditions });
        return this.allAlertConditions;
      },
      (error) => {
        UserNotification.error(`获取告警条件失败: ${error}`,
          '无法获取告警条件');
      },
    );
    AlertConditionsActions.listAll.promise(promise);
  },

  list(streamId) {
    const failCallback = (error) => {
      UserNotification.error(`获取告警条件失败: ${error}`,
        '无法获取告警条件');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.list(streamId).url);
    const promise = fetch('GET', url).then((response) => {
      const conditions = response.conditions.map((condition) => {
        const cond = _.clone(condition);
        cond.stream_id = streamId;
        return cond;
      });
      this.trigger({ alertConditions: conditions });
      return conditions;
    }, failCallback);

    AlertConditionsActions.list.promise(promise);
    return promise;
  },
  save(streamId, alertCondition) {
    const failCallback = (error) => {
      UserNotification.error(`保存告警条件失败: ${error}`,
        '无法获取告警条件');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.create(streamId).url);
    const promise = fetch('POST', url, alertCondition).then((response) => {
      UserNotification.success('告警条件创建成功');
      return response.alert_condition_id;
    }, failCallback);

    AlertConditionsActions.save.promise(promise);
    return promise;
  },
  update(streamId, alertConditionId, request) {
    const failCallback = (error) => {
      UserNotification.error(`保存告警条件失败: ${error}`,
        '无法保存告警条件');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.update(streamId, alertConditionId).url);
    const promise = fetch('PUT', url, request).then((response) => {
      UserNotification.success('告警条件更新成功');
      return response;
    }, failCallback);

    AlertConditionsActions.update.promise(promise);
    return promise;
  },
  get(streamId, conditionId, failureCallback) {
    const failCallback = (error) => {
      UserNotification.error(`获取告警条件 ${conditionId} 失败: ${error}`,
        '无法获取告警条件');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.get(streamId, conditionId).url);
    const promise = fetch('GET', url);
    promise.then(
      (response) => {
        this.trigger({ alertCondition: response });
        return response;
      },
      (error) => {
        return (typeof failureCallback === 'function' ? failureCallback(error) : failCallback(error));
      });

    AlertConditionsActions.get.promise(promise);
  },
});

export default AlertConditionsStore;
