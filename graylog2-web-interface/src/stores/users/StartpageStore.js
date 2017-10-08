import Reflux from 'reflux';
import ApiRoutes from 'routing/ApiRoutes';
import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

const StartpageStore = Reflux.createStore({
  listenables: [],

  set(username, type, id) {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.update(username).url);
    const payload = {};
    if (type && id) {
      payload.type = type;
      payload.id = id;
    }
    return fetch('PUT', url, { startpage: payload })
      .then(
        (response) => {
          this.trigger();
          UserNotification.success('起始页修改成功');
          return response;
        },
        error => UserNotification.error(`修改起始页失败: ${error}`, '无法修改起始页'),
      );
  },
});

export default StartpageStore;
