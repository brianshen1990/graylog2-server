import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';

const LookupTablesActions = ActionsProvider.getActions('LookupTables');

const LookupTablesStore = Reflux.createStore({
  listenables: [LookupTablesActions],

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
      pagination: this.pagination,
      errorStates: {
        tables: {},
        caches: {},
        dataAdapters: {},
      },
    };
  },

  reloadPage() {
    const promise = this.searchPaginated(this.pagination.page, this.pagination.per_page,
      this.pagination.query);
    LookupTablesActions.reloadPage.promise(promise);
    return promise;
  },

  searchPaginated(page, perPage, query) {
    let url;
    if (query) {
      url = this._url(
        `tables?page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}&resolve=true`);
    } else {
      url = this._url(`tables?page=${page}&per_page=${perPage}&resolve=true`);
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
      this.trigger({
        tables: response.lookup_tables,
        caches: response.caches,
        dataAdapters: response.data_adapters,
        pagination: this.pagination,
      });
    }, this._errorHandler('获取查找表失败', '无法获取查找表'));

    LookupTablesActions.searchPaginated.promise(promise);
    return promise;
  },

  get(idOrName) {
    const url = this._url(`tables/${idOrName}?resolve=true`);
    const promise = fetch('GET', url);

    promise.then((response) => {
      // do not propagate pagination! it will destroy the subsequent overview page's state.
      const lookupTable = response.lookup_tables[0];
      this.trigger({
        table: lookupTable,
        cache: response.caches[lookupTable.cache_id],
        dataAdapter: response.data_adapters[lookupTable.data_adapter_id],
      });
    }, this._errorHandler(`获取查找表 ${idOrName} 失败`,
      '无法获取查找表'));

    LookupTablesActions.get.promise(promise);
    return promise;
  },

  create(table) {
    const url = this._url('tables');
    const promise = fetch('POST', url, table);

    promise.catch(this._errorHandler('创建查找表失败', `无法创建查找表 "${table.name}"`));

    LookupTablesActions.create.promise(promise);
    return promise;
  },

  update(table) {
    const url = this._url(`tables/${table.id}`);
    const promise = fetch('PUT', url, table);

    promise.catch(this._errorHandler('查找表更新失败', `无法更新查找表 "${table.name}"`));

    LookupTablesActions.update.promise(promise);
    return promise;
  },

  delete(idOrName) {
    const url = this._url(`tables/${idOrName}`);
    const promise = fetch('DELETE', url);

    promise.catch(this._errorHandler('删除查找表失败', `无法删除查找表 "${idOrName}"`));

    LookupTablesActions.delete.promise(promise);
    return promise;
  },

  getErrors(tableNames, cacheNames, dataAdapterNames) {
    const request = {};
    if (tableNames) {
      request.tables = tableNames;
    }
    if (cacheNames) {
      request.caches = cacheNames;
    }
    if (dataAdapterNames) {
      request.data_adapters = dataAdapterNames;
    }

    const promise = fetch('POST', this._url('errorstates'), request);

    promise.then((response) => {
      this.trigger({
        errorStates: {
          tables: response.tables || {},
          caches: response.caches || {},
          dataAdapters: response.data_adapters || {},
        },
      });
    }, this._errorHandler('获取查找表错误状态失败.', '无法获取错误状态'));

    LookupTablesActions.getErrors.promise(promise);
    return promise;
  },

  lookup(tableName, key) {
    const promise = fetch('GET', this._url(`tables/${tableName}/query?key=${key}`));

    promise.then((response) => {
      this.trigger({
        lookupResult: response,
      });
    }, this._errorHandler('查找失败', `无法为关键字 "${key}" 查找值，在查找表 "${tableName}"中`));

    LookupTablesActions.lookup.promise(promise);
    return promise;
  },

  purgeKey(table, key) {
    const promise = fetch('POST', this._url(`tables/${table.id}/purge?key=${key}`));

    promise.then(() => {
      UserNotification.success(`成功删除缓存关键字 "${key}" 在查找表 "${table.name}"`, '成功!');
    }, this._errorHandler(`无法删除缓存关键字 "${key}" 在查找表 "${table.name}"`, '失败!'));

    LookupTablesActions.purgeKey.promise(promise);
    return promise;
  },

  purgeAll(table) {
    const promise = fetch('POST', this._url(`tables/${table.id}/purge`));

    promise.then(() => {
      UserNotification.success(`成功删除缓存 在查找表 "${table.name}"`, '成功!');
    }, this._errorHandler(`无法删除缓存 在查找表 "${table.name}"`, '失败!'));

    LookupTablesActions.purgeAll.promise(promise);
    return promise;
  },

  validate(table) {
    const url = this._url('tables/validate');
    const promise = fetch('POST', url, table);

    promise.then((response) => {
      this.trigger({
        validationErrors: response.errors,
      });
    }, this._errorHandler('查找表验证失败', `无法验证查找表 "${table.name}"`));
    LookupTablesActions.validate.promise(promise);
    return promise;
  },

  _errorHandler(message, title, cb) {
    return (error) => {
      try {
        // Do not show the user notification if the error is a hibernate error message. We cannot display those
        // properly yet...
        if (error.additional.body[0].message_template) {
          return;
        }
      } catch (e) {
        // ignored
      }
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

export default LookupTablesStore;
