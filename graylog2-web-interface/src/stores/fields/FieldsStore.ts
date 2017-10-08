/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;
import Immutable = require('immutable');
const UserNotification = require("util/UserNotification");
const URLUtils = require('util/URLUtils');

var FieldsStore = {
    loadFields(): Promise<string[]> {
        const url = ApiRoutes.SystemApiController.fields().url;
        let promise = fetch('GET', URLUtils.qualifyUrl(url));
        promise = promise.then((data) => data.fields);
        promise.catch((errorThrown) => {
            UserNotification.error("加载字段信息失败: " + errorThrown.additional.message,
                "无法加载字段信息");
        });
        return promise;
    }
};
export = FieldsStore;
