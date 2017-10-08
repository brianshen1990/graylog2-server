import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const InputStaticFieldsStore = Reflux.createStore({
  listenables: [],
  sourceUrl: inputId => `/system/inputs/${inputId}/staticfields`,

  create(input, name, value) {
    const url = URLUtils.qualifyUrl(this.sourceUrl(input.id));
    const promise = fetch('POST', url, { key: name, value: value });
    promise
      .then(
        (response) => {
          this.trigger({});
          UserNotification.success(`添加静态字段 '${name}' 至输入 '${input.title}' 成功`);
          return response;
        },
        (error) => {
          UserNotification.error(`添加静态字段失败: ${error}`,
            `无法添加静态字段至输入 '${input.title}'`);
        });

    return promise;
  },

  destroy(input, name) {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl(input.id)}/${name}`);
    const promise = fetch('DELETE', url);
    promise
      .then(
        (response) => {
          this.trigger({});
          UserNotification.success(`移除静态字段 '${name}' 从输入 '${input.title}' 失败`);
          return response;
        },
        (error) => {
          UserNotification.error(`移除静态字段失败: ${error}`,
            `无法移除静态字段 '${name} 从输入 '${input.title}'`);
        });

    return promise;
  },
});

export default InputStaticFieldsStore;
