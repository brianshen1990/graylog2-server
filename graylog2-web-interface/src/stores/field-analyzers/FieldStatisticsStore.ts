/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />
/// <reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
/// <reference path="../../../declarations/node/node.d.ts" />

const fetch = require('logic/rest/FetchProvider').default;
import Immutable = require('immutable');
import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const UserNotification = require('util/UserNotification');

const StoreProvider = require('injection/StoreProvider');
const SearchStore = StoreProvider.getStore('Search');

const FieldStatisticsStore = {
    FUNCTIONS: Immutable.OrderedMap({
        count: '全部',
        mean: '均值',
        min: '最小值',
        max: '最大值',
        std_deviation: '标准偏差',
        variance: '方差',
        sum: '综合',
        cardinality: '基数',
    }),
    getFieldStatistics(field: string): Promise<string[]> {
        var originalSearchURLParams = SearchStore.getOriginalSearchURLParams();
        var streamId = SearchStore.searchInStream ? SearchStore.searchInStream.id : null;

        var rangeType = originalSearchURLParams.get('rangetype');
        var timerange = {};
        switch(rangeType) {
            case 'relative':
                timerange['range'] = originalSearchURLParams.get('relative');
                break;
            case 'absolute':
                timerange['from'] = originalSearchURLParams.get('from');
                timerange['to'] = originalSearchURLParams.get('to');
                break;
            case 'keyword':
                timerange['keyword'] = originalSearchURLParams.get('keyword');
                break;
        }

        var url = ApiRoutes.UniversalSearchApiController.fieldStats(
            rangeType,
            originalSearchURLParams.get('q') || '*',
            field,
            timerange,
            streamId
        ).url;

        url = URLUtils.qualifyUrl(url);

        var promise = fetch('GET', url);
        promise.catch(error => {
            UserNotification.error("导入字段统计失败: " + error,
                "无法导入字段统计");
        });

        return promise;
    }
};

module.exports = FieldStatisticsStore;
