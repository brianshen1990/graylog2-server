import Reflux from 'reflux';
import Qs from 'qs';
import fetch from 'logic/rest/FetchProvider';

import ApiRoutes from 'routing/ApiRoutes';
import Routes from 'routing/Routes';

import ActionsProvider from 'injection/ActionsProvider';
const SavedSearchesActions = ActionsProvider.getActions('SavedSearches');

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

const SavedSearchesStore = Reflux.createStore({
  listenables: [SavedSearchesActions],
  sourceUrl: '/search/saved',
  savedSearches: undefined,

  init() {
    this.trigger({ savedSearches: this.savedSearches });
  },

  list() {
    const promise = fetch('GET', URLUtils.qualifyUrl(URLUtils.concatURLPath(this.sourceUrl)))
      .then(
        (response) => {
          this.savedSearches = response.searches;
          this.trigger({ savedSearches: this.savedSearches });
          return response;
        },
        (error) => {
          UserNotification.error(`获取存档搜索结果失败: ${error}`,
            '无法获取存档搜索结果');
        });

    SavedSearchesActions.list.promise(promise);
  },

  getSavedSearch(searchId) {
    let currentSavedSearch;
    for (let i = 0; i < this.savedSearches.length && !currentSavedSearch; i++) {
      if (this.savedSearches[i].id === searchId) {
        currentSavedSearch = this.savedSearches[i];
      }
    }

    return currentSavedSearch;
  },

  isValidTitle(searchId, title) {
    for (let i = 0; i < this.savedSearches.length; i++) {
      const savedSearch = this.savedSearches[i];
      if (savedSearch.id !== searchId && savedSearch.title === title) {
        return false;
      }
    }

    return true;
  },

  execute(searchId, streamId, width) {
    const savedSearch = this.getSavedSearch(searchId);
    if (!savedSearch) {
      // show notification
      SavedSearchesActions.load.triggerPromise();
      return;
    }

    const searchQuery = {
      saved: searchId,
      width: width,
    };
    for (const paramName in savedSearch.query) {
      if (Object.hasOwnProperty.call(savedSearch.query, paramName)) {
        const effectiveParamName = (paramName.toLowerCase() === 'query' ? 'q' : paramName.toLowerCase());
        searchQuery[effectiveParamName] = savedSearch.query[paramName];
      }
    }

    let url;
    if (streamId) {
      url = Routes.stream_search(streamId);
    } else {
      url = Routes.SEARCH;
    }
    url = `${url}?${Qs.stringify(searchQuery)}`;
    SearchStore.executeSearch(url);
  },

  _createOrUpdate(title, searchId) {
    const originalSearchParams = SearchStore.getOriginalSearchParamsWithFields();
    const queryParams = originalSearchParams.set('rangeType', originalSearchParams.get('range_type')).delete('range_type');
    const params = { title: title, query: queryParams.toJS() };

    let url;
    let verb;

    if (!searchId) {
      url = ApiRoutes.SavedSearchesApiController.create().url;
      verb = 'POST';
    } else {
      url = ApiRoutes.SavedSearchesApiController.update(searchId).url;
      verb = 'PUT';
    }

    return fetch(verb, URLUtils.qualifyUrl(url), JSON.stringify(params));
  },

  create(title) {
    const promise = this._createOrUpdate(title);
    promise
      .then(
        (response) => {
          UserNotification.success(`搜索准则 "${title}"保存成功.`);
          SavedSearchesActions.list.triggerPromise();
          return response;
        },
        (error) => {
          UserNotification.error(`搜索准则保存失败: ${error}`,
            '无法保存搜索准则');
        });

    SavedSearchesActions.create.promise(promise);
  },

  update(searchId, title) {
    const promise = this._createOrUpdate(title, searchId);
    promise
      .then(
        (response) => {
          UserNotification.success(`存档搜索结果 "${title}" 保存成功.`);
          SavedSearchesActions.list.triggerPromise();
          return response;
        },
        (error) => {
          UserNotification.error(`更新存档搜索结果 "${title}" 失败: ${error}`,
            '无法更新存档搜索结果');
        });

    SavedSearchesActions.update.promise(promise);
  },

  delete(searchId) {
    const savedSearch = this.savedSearches.find(s => s.id === searchId);
    const title = savedSearch ? `"${savedSearch.title}"` : searchId;
    const url = ApiRoutes.SavedSearchesApiController.delete(searchId).url;
    const promise = fetch('DELETE', URLUtils.qualifyUrl(url));
    promise
      .then(
        (response) => {
          UserNotification.success(`存档搜索 ${title} 删除成功.`);
          SearchStore.savedSearchDeleted(searchId);
          SavedSearchesActions.list.triggerPromise();
          return response;
        },
        (error) => {
          UserNotification.error(`存档搜索结果 ${title} 删除失败: ${error}`,
            '无法删除存档搜索结果');
        });

    SavedSearchesActions.delete.promise(promise);
  },
});

export default SavedSearchesStore;
