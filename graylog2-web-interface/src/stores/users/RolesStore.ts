/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');

// Need to use explicit require here to be able to access the User interface
import UsersStore = require("./UsersStore");

const ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;

interface Role {
  name: string;
  description: string;
  permissions: string[];
}

interface RoleMembership {
  role: string;
  users: UsersStore.User[];
}

const RolesStore = {
  loadRoles(): Promise<string[]> {
    const promise = fetch('GET', URLUtils.qualifyUrl(ApiRoutes.RolesApiController.listRoles().url))
      .then(
        response => response.roles,
        error => {
          if (error.additional.status !== 404) {
            UserNotification.error("导入角色列表失败: " + error,
              "无法导入角色列表");
          }
        }
      );

    return promise;
  },

  createRole(role: Role): Promise<Role> {
    const url = URLUtils.qualifyUrl(ApiRoutes.RolesApiController.createRole().url);
    const promise = fetch('POST', url, role);

    promise.then((newRole) => {
      UserNotification.success("角色 \"" + newRole.name + "\" 创建成功");
    }, (error) => {
      UserNotification.error("角色 \"" + role.name + "\" 创建失败: " + error,
        "无法创建角色");
    });

    return promise;
  },

  updateRole(rolename: string, role: Role): Promise<Role> {
    const promise = fetch('PUT', URLUtils.qualifyUrl(ApiRoutes.RolesApiController.updateRole(encodeURIComponent(rolename)).url), role);

    promise.then((newRole) => {
      UserNotification.success("角色 \"" + newRole.name + "\" 更新成功");
    }, (error) => {
      if (error.additional.status !== 404) {
        UserNotification.error("更新角色失败: " + error,
          "无法更新角色");
      }
    });

    return promise;
  },

  deleteRole(rolename: string): Promise<string[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.RolesApiController.deleteRole(encodeURIComponent(rolename)).url);
    const promise = fetch('DELETE', url);

    promise.then(() => {
      UserNotification.success("角色 \"" + rolename + "\" 删除成功");
    }, (error) => {
      if (error.additional.status !== 404) {
        UserNotification.error("角色删除失败: " + error,
          "无法删除角色");
      }
    });
    return promise;
  },
  getMembers(rolename: string): Promise<RoleMembership[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.RolesApiController.loadMembers(encodeURIComponent(rolename)).url);
    const promise = fetch('GET', url);
    promise.catch((error) => {
      if (error.additional.status !== 404) {
        UserNotification.error("无法导入角色成员: " + error,
          "角色成员导入失败");
      }
    });
    return promise;
  }
};

export = RolesStore;
