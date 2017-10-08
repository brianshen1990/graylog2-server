/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;

export interface StartPage {
  id: string;
  type: string;
}

export interface User {
  username: string;
  id: string;
  full_name: string;
  email: string;
  permissions: string[];
  timezone: string;
  preferences?: any;
  roles: string[];

  read_only: boolean;
  external: boolean;
  session_timeout_ms: number;

  startpage?: StartPage;
}

export interface ChangePasswordRequest {
  old_password: string;
  password: string;
}

export const UsersStore = {
  editUserFormUrl(username: string) {
    return URLUtils.qualifyUrl("/system/users/edit/" + username);
  },

  create(request: any): Promise<string[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.create().url);
    const promise = fetch('POST', url, request);
    return promise;
  },

  loadUsers(): Promise<User[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.list().url);
    const promise = fetch('GET', url)
      .then(
        response => response.users,
        (error) => {
          if (error.additional.status !== 404) {
            UserNotification.error("加载用户列表失败: " + error,
              "无法加载用户列表");
          }
        });
    return promise;
  },

  load(username: string): Promise<User> {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.load(encodeURIComponent(username)).url);
    const promise = fetch('GET', url);
    promise.catch((error) => {
      UserNotification.error("加载用户失败: " + error,
        "无法加载用户 " + username);
    });

    return promise;
  },

  deleteUser(username: string): Promise<string[]> {
    const  url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.delete(encodeURIComponent(username)).url);
    const  promise = fetch('DELETE', url);

    promise.then(() => {
      UserNotification.success("用户 \"" + username + "\" 删除成功");
    }, (error) => {
      if (error.additional.status !== 404) {
        UserNotification.error("删除用户出错: " + error,
          "无法删除用户");
      }
    });

    return promise;
  },

  changePassword(username: string, request: ChangePasswordRequest): void {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.changePassword(encodeURIComponent(username)).url);
    const promise = fetch('PUT', url, request);

    return promise;
  },

  update(username: string, request: any): void {
    const url = URLUtils.qualifyUrl(ApiRoutes.UsersApiController.update(encodeURIComponent(username)).url);
    const promise = fetch('PUT', url, request);

    return promise;
  },
};

module.exports = UsersStore;
