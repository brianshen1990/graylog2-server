/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

const Reflux = require('reflux');

const UserNotification = require('util/UserNotification');
import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const fetchPeriodically = require('logic/rest/FetchProvider').fetchPeriodically;
const fetch = require('logic/rest/FetchProvider').default;

const ActionsProvider = require('injection/ActionsProvider');
const WidgetsActions = ActionsProvider.getActions('Widgets');

interface Widget {
    id: string;
    description: string;
    type: string;
    cache_time: number;
    creator_user_id?: string;
    config: {};
}

const WidgetsStore = Reflux.createStore({
    listenables: [WidgetsActions],
    _serializeWidgetForUpdate(widget: Widget): any {
        return {
            description: widget.description,
            type: widget.type,
            cache_time: widget.cache_time,
            creator_user_id: widget.creator_user_id,
            config: widget.config,
        };
    },

    addWidget(dashboardId: string, widgetType: string, widgetTitle: string, widgetConfig: Object): Promise<string[]> {
        var widgetData = {description: widgetTitle, type: widgetType, config: widgetConfig};
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.addWidget(dashboardId).url);
        var promise = fetch('POST', url, widgetData);

        promise.then(
          response => {
              UserNotification.success("组件创建成功");
              return response;
          },
          error => {
              if (error.additional.status !== 404) {
                  UserNotification.error("创建组件失败: " + error,
                    "无法创建组件");
              }
          });

        return promise;
    },

    loadWidget(dashboardId: string, widgetId: string): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.widget(dashboardId, widgetId).url);
        const promise = fetchPeriodically('GET', url);

        promise.catch((error) => {
            if (error.additional.status !== 404) {
                UserNotification.error("加载组件信息失败: " + error,
                    "无法加载组件信息");
            }
        });
        return promise;
    },

    updateWidget(dashboardId: string, widget: Widget): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.updateWidget(dashboardId, widget.id).url);
        var promise = fetch('PUT', url, this._serializeWidgetForUpdate(widget));

        promise.then(
          response => {
              UserNotification.success("组件更新成功");
              return response;
          },
          error => {
              UserNotification.error("更新组件 \"" + widget.description + "\" 失败: " + error.message,
                "无法更新组件");
          }
        );

        return promise;
    },

    loadValue(dashboardId: string, widgetId: string, resolution: number): Promise<string[]> {
        var url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.widgetValue(dashboardId, widgetId, resolution).url);

        return fetchPeriodically('GET', url);
    },

    removeWidget(dashboardId: string, widgetId: string): Promise<string[]> {
        const url = URLUtils.qualifyUrl(ApiRoutes.DashboardsApiController.removeWidget(dashboardId, widgetId).url);

        const promise = fetch('DELETE', url).then(response => {
            this.trigger({delete: widgetId});
            return response;
        });
        WidgetsActions.removeWidget.promise(promise);

        return promise;
    },
});

module.exports = WidgetsStore;
