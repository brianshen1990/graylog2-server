import Reflux from 'reflux';

import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const AuthenticationActions = ActionsProvider.getActions('Authentication');


const AuthenticationStore = Reflux.createStore({
  listenables: [AuthenticationActions],
  sourceUrl: '/system/authentication/config',

  getInitialState() {
    return {
      authenticators: null,
    };
  },

  load() {
    const url = URLUtils.qualifyUrl(this.sourceUrl);
    const promise = fetch('GET', url)
      .then(
        (response) => {
          this.trigger({ authenticators: response });
          return response;
        },
        error => UserNotification.error(`无法导入认证配置: ${error}`, '无法导入认证配置'),
      );

    AuthenticationActions.load.promise(promise);
  },

  update(type, config) {
    const url = URLUtils.qualifyUrl(this.sourceUrl);
    if (type === 'providers') {
      const promise = fetch('PUT', url, config)
        .then(
          (response) => {
            this.trigger({ authenticators: response });
            UserNotification.success('配置更新成功');
            return response;
          },
          error => UserNotification.error(`保存验证供应配置失败: ${error}`, '无法保存配置'),
        );
      AuthenticationActions.update.promise(promise);
    }
  },
});

export default AuthenticationStore;
