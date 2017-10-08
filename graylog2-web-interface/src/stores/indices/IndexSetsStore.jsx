import Reflux from 'reflux';

import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const IndexSetsActions = ActionsProvider.getActions('IndexSets');

const IndexSetsStore = Reflux.createStore({
  listenables: [IndexSetsActions],

  list(stats) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.list(stats).url);
    const promise = fetch('GET', url);
    promise
      .then(
        response => this.trigger({
          indexSetsCount: response.total,
          indexSets: response.index_sets,
          indexSetStats: response.stats,
        }),
        (error) => {
          UserNotification.error(`获取索引集失败: ${error.message}`,
            '无法获取索引集.');
        });

    IndexSetsActions.list.promise(promise);
  },

  listPaginated(skip, limit, stats) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.listPaginated(skip, limit, stats).url);
    const promise = fetch('GET', url);
    promise
      .then(
        response => this.trigger({
          indexSetsCount: response.total,
          indexSets: response.index_sets,
          indexSetStats: response.stats,
        }),
        (error) => {
          UserNotification.error(`获取索引集失败: ${this._errorMessage(error)}`,
            '无法获取索引集.');
        });

    IndexSetsActions.listPaginated.promise(promise);
  },

  get(indexSetId) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.get(indexSetId).url);
    const promise = fetch('GET', url);
    promise.then(
      (response) => {
        this.trigger({ indexSet: response });
        return response;
      },
      (error) => {
        UserNotification.error(`获取索引集 '${indexSetId}' 失败: ${this._errorMessage(error)}`, '无法获取索引集.');
      },
    );

    IndexSetsActions.get.promise(promise);
  },

  update(indexSet) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.get(indexSet.id).url);
    const promise = fetch('PUT', url, indexSet);
    promise.then(
      (response) => {
        UserNotification.success(`成功更新索引集'${indexSet.title}'`, '成功');
        this.trigger({ indexSet: response });
        return response;
      },
      (error) => {
        UserNotification.error(`更新索引集 '${indexSet.title}' 失败: ${this._errorMessage(error)}`, '无法更新索引集.');
      },
    );

    IndexSetsActions.update.promise(promise);
  },

  create(indexSet) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.create().url);
    const promise = fetch('POST', url, indexSet);
    promise.then(
      (response) => {
        UserNotification.success(`成功创建索引集 '${indexSet.title}'`, '成功');
        this.trigger({ indexSet: response });
        return response;
      },
      (error) => {
        UserNotification.error(`创建索引集 '${indexSet.title}' 失败: ${this._errorMessage(error)}`, '无法创建索引集.');
      },
    );

    IndexSetsActions.create.promise(promise);
  },

  delete(indexSet, deleteIndices) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.delete(indexSet.id, deleteIndices).url);
    const promise = fetch('DELETE', url);
    promise.then(
      () => {
        UserNotification.success(`成功删除索引集 '${indexSet.title}'`, '成功');
      },
      (error) => {
        UserNotification.error(`删除索引集 '${indexSet.title}' 失败: ${this._errorMessage(error)}`, '无法删除索引集.');
      },
    );

    IndexSetsActions.delete.promise(promise);
  },

  setDefault(indexSet) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexSetsApiController.setDefault(indexSet.id).url);
    const promise = fetch('PUT', url);
    promise.then(
      () => {
        UserNotification.success(`成功设置索引集 '${indexSet.title}' 为默认`, '成功');
      },
      (error) => {
        UserNotification.error(`设置索引集 '${indexSet.title}' 为默认失败s: ${this._errorMessage(error)}`, '无法设置默认索引集.');
      },
    );

    IndexSetsActions.setDefault.promise(promise);
  },

  _errorMessage(error) {
    try {
      return error.additional.body.message;
    } catch (e) {
      return error.message;
    }
  },
});

export default IndexSetsStore;
