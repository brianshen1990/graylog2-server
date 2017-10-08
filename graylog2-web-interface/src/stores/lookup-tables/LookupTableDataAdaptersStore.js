import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';

const LookupTableDataAdaptersActions = ActionsProvider.getActions('LookupTableDataAdapters');

const LookupTableDataAdaptersStore = Reflux.createStore({
  listenables: [LookupTableDataAdaptersActions],

  init() {
    this.pagination = {
      page: 1,
      per_page: 10,
      total: 0,
      count: 0,
      query: null,
    };
  },

  getInitialState() {
    return {
      dataAdapters: undefined,
      pagination: this.pagination,
      validationErrors: {},
    };
  },

  reloadPage() {
    const promise = this.searchPaginated(this.pagination.page, this.pagination.per_page, this.pagination.query);
    LookupTableDataAdaptersActions.reloadPage.promise(promise);
    return promise;
  },

  searchPaginated(page, perPage, query) {
    let url;
    if (query) {
      url = this._url(`adapters?page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}`);
    } else {
      url = this._url(`adapters?page=${page}&per_page=${perPage}`);
    }
    const promise = fetch('GET', url);

    promise.then((response) => {
      this.pagination = {
        count: response.count,
        total: response.total,
        page: response.page,
        per_page: response.per_page,
        query: response.query,
      };
      this.trigger({ pagination: this.pagination, dataAdapters: response.data_adapters });
    }, this._errorHandler('获取查找表 数据转接器失败', '无法获取查找表 数据转接器'));

    LookupTableDataAdaptersActions.searchPaginated.promise(promise);
    return promise;
  },

  get(idOrName) {
    const url = this._url(`adapters/${idOrName}`);
    const promise = fetch('GET', url);

    promise.then((response) => {
      this.trigger({ dataAdapter: response });
    }, this._errorHandler(`获取查找表 数据转接器 ${idOrName} 失败`, '无法获取查找表 数据转接器'));

    LookupTableDataAdaptersActions.get.promise(promise);
    return promise;
  },

  create(dataAdapter) {
    const url = this._url('adapters');
    const promise = fetch('POST', url, dataAdapter);

    promise.then((response) => {
      this.trigger({ dataAdapter: response });
    }, this._errorHandler('创建查找表 数据转接器失败', `无法创建查找表 数据转接器 "${dataAdapter.name}"`));

    LookupTableDataAdaptersActions.create.promise(promise);
    return promise;
  },

  update(dataAdapter) {
    const url = this._url(`adapters/${dataAdapter.id}`);
    const promise = fetch('PUT', url, dataAdapter);

    promise.then((response) => {
      this.trigger({ dataAdapter: response });
    }, this._errorHandler('更新查找表 数据转接器失败', `无法更新查找表 数据转接器 "${dataAdapter.name}"`));

    LookupTableDataAdaptersActions.update.promise(promise);
    return promise;
  },

  getTypes() {
    const url = this._url('types/adapters');
    const promise = fetch('GET', url);

    promise.then((response) => {
      this.trigger({ types: response });
    }, this._errorHandler('获取可用类型失败', '无法获取查找表 数据转接器可用类型'));

    LookupTableDataAdaptersActions.getTypes.promise(promise);
    return promise;
  },

  delete(idOrName) {
    const url = this._url(`adapters/${idOrName}`);
    const promise = fetch('DELETE', url);

    promise.catch(this._errorHandler('删除查找表 数据转接器失败', `无法删除查找表 数据转接器 "${idOrName}"`));

    LookupTableDataAdaptersActions.delete.promise(promise);
    return promise;
  },

  lookup(adapterName, key) {
    const promise = fetch('GET', this._url(`adapters/${adapterName}/query?key=${key}`));

    promise.then((response) => {
      this.trigger({
        lookupResult: response,
      });
    }, this._errorHandler('查找失败', `无法查找关键字"${key}" 的值，在查找表 数据转接器 "${adapterName}"`));

    LookupTableDataAdaptersActions.lookup.promise(promise);

    return promise;
  },

  validate(adapter) {
    const url = this._url('adapters/validate');
    const promise = fetch('POST', url, adapter);

    promise.then((response) => {
      this.trigger({
        validationErrors: response.errors,
      });
    }, this._errorHandler('查找表 数据转接器验证失败', `无法验证查找表 数据转接器 "${adapter.name}"`));
    LookupTableDataAdaptersActions.validate.promise(promise);
    return promise;
  },

  _errorHandler(message, title, cb) {
    return (error) => {
      let errorMessage;
      try {
        errorMessage = error.additional.body.message;
      } catch (e) {
        errorMessage = error.message;
      }
      UserNotification.error(`${message}: ${errorMessage}`, title);
      if (cb) {
        cb(error);
      }
    };
  },

  _url(path) {
    return URLUtils.qualifyUrl(`/system/lookup/${path}`);
  },
});

export default LookupTableDataAdaptersStore;
