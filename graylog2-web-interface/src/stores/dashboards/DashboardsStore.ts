/// <reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
/// <reference path='../../routing/ApiRoutes.d.ts' />
/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

import Immutable = require('immutable');
const UserNotification = require('util/UserNotification');
import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const Builder = require('logic/rest/FetchProvider').Builder;
const fetchPeriodically = require('logic/rest/FetchProvider').fetchPeriodically;
const fetch = require('logic/rest/FetchProvider').default;
const PermissionsMixin = require('util/PermissionsMixin');

const StoreProvider = require('injection/StoreProvider');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const SessionStore = StoreProvider.getStore('Session');

interface Dashboard {
  id: string;
  description: string;
  title: string;
  content_pack: string;
}

class DashboardsStore {
  private _writableDashboards: Immutable.Map<string, Dashboard>;
  private _dashboards: Immutable.List<Dashboard>;
  private _onWritableDashboardsChanged: {(dashboards: Immutable.Map<string, Dashboard>): void; }[] = [];
  private _onDashboardsChanged: {(dashboards: Immutable.List<Dashboard>): void; }[] = [];

  constructor() {
    this._initializeDashboards();
    SessionStore.listen(this.onSessionChange, this);
  }

  _initializeDashboards() {
    this._dashboards = Immutable.List<Dashboard>();
    this._writableDashboards = Immutable.Map<string, Dashboard>();
  }

  onSessionChange() {
    if (!SessionStore.isLoggedIn()) {
      this._initializeDashboards();
    }
  }

  get dashboards(): Immutable.List<Dashboard> {
    return this._dashboards;
  }

  set dashboards(newDashboards: Immutable.List<Dashboard>) {
    this._dashboards = newDashboards;
    this._emitDashboardsChange();
  }

  _emitDashboardsChange() {
    this._onDashboardsChanged.forEach((callback) => callback(this.dashboards));
  }

  get writableDashboards(): Immutable.Map<string, Dashboard> {
    return this._writableDashboards;
  }

  set writableDashboards(newDashboards: Immutable.Map<string, Dashboard>) {
    this._writableDashboards = newDashboards;
    this._emitWritableDashboardsChange();
  }

  _emitWritableDashboardsChange() {
    this._onWritableDashboardsChanged.forEach((callback) => callback(this.writableDashboards));
  }

  addOnWritableDashboardsChangedCallback(dashboardChangeCallback: (dashboards: Immutable.Map<string, Dashboard>) => void) {
    this._onWritableDashboardsChanged.push(dashboardChangeCallback);
  }

  addOnDashboardsChangedCallback(dashboardChangeCallback: (dashboards: Immutable.List<Dashboard>) => void) {
    this._onDashboardsChanged.push(dashboardChangeCallback);
  }

  updateWritableDashboards() {
    const permissions = CurrentUserStore.get().permissions;
    const promise = this.updateDashboards();
    promise.then(() => {
      const dashboards = {};
      this.getWritableDashboardList(permissions).forEach((dashboard) => {
        dashboards[dashboard.id] = dashboard;
      });
      this.writableDashboards = Immutable.Map<string, Dashboard>(dashboards);
    });
  }

  updateDashboards() {
    const promise = this.listDashboards();
    promise.then((dashboardList) => {
      this.dashboards = dashboardList;
    });

    return promise;
  }

  listDashboards(): Promise<Immutable.List<Dashboard>> {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.index().url);
    const promise = fetch('GET', url)
      .then((response) => {
        const dashboardList = Immutable.List<Dashboard>(response.dashboards);

        return dashboardList;
      }, (error) => {
        if (error.additional.status !== 404) {
          UserNotification.error("导入面板失败: " + error,
            "无法导入面板");
        }
      });
    return promise;
  }

  getWritableDashboardList(permissions: Array<string>): Array<Dashboard> {
    return this.dashboards.toArray().filter((dashboard) => PermissionsMixin.isPermitted(permissions, 'dashboards:edit:' + dashboard.id));
  }

  get(id: string): Promise<Dashboard> {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.get(id).url);
    const promise = fetchPeriodically('GET', url);

    promise.catch((error) => {
      if (error.additional.status !== 404) {
        UserNotification.error("导入面板失败: " + error.message,
          "无法导入面板");
      }
    });

    return promise;
  }

  createDashboard(title: string, description: string): Promise<string[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.create().url);
    const promise = fetch('POST', url, {title: title, description: description})
      .then((response) => {
        UserNotification.success("面板成功创建");
        this.updateWritableDashboards();
        return response.dashboard_id;
      }, (error) => {
        UserNotification.error("创建面板 \"" + title + "\" 失败: " + error,
          "无法创建面板");
      });

    return promise;
  }

  saveDashboard(dashboard: Dashboard): Promise<string[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.update(dashboard.id).url);
    const promise = fetch('PUT', url, {title: dashboard.title, description: dashboard.description});

    promise.then(() => {
      UserNotification.success("面板更新成功");
      this.updateWritableDashboards();
    }, (error) => {
      UserNotification.error("保存面板 \"" + dashboard.title + "\" 失败: " + error,
        "无法保存面板");
    });

    return promise;
  }

  remove(dashboard: Dashboard): Promise<string[]> {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.delete(dashboard.id).url);
    const promise = fetch('DELETE', url)

    promise.then(() => {
      UserNotification.success("面板删除成功");
      this.updateWritableDashboards();
    }, (error) => {
      UserNotification.error("面板 \"" + dashboard.title + "\" 删除失败: " + error,
        "无法删除面板");
    });

    return promise;
  }

  updatePositions(dashboard: Dashboard, positions: any) {
    const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.updatePositions(dashboard.id).url);
    const promise = fetch('PUT', url, {positions: positions}).catch((error) => {
      UserNotification.error("为面板 \"" + dashboard.title + "\" 更新组件位置失败: " + error.message,
        "无法更新面板");
    });

    return promise;
  }
}

const dashboardsStore = new DashboardsStore();
export = dashboardsStore;
