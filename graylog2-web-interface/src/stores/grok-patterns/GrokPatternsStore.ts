const UserNotification = require("util/UserNotification");
const URLUtils = require('util/URLUtils');

const fetch = require('logic/rest/FetchProvider').default;
const fetchPlainText = require('logic/rest/FetchProvider').fetchPlainText;

interface GrokPattern {
  id: string;
  name: string;
  pattern: string;
}

const GrokPatternsStore = {
  URL: URLUtils.qualifyUrl('/system/grok'),

  loadPatterns(callback: (patterns: Array<GrokPattern>) => void) {
    var failCallback = (error) => {
      UserNotification.error("导入 Grok 模式失败: " + error.message,
        "无法导入Grok 模式");
    };
    // get the current list of patterns and sort it by name
    fetch('GET', this.URL).then(
      (resp: any) => {
        const patterns = resp.patterns;
        patterns.sort((pattern1: GrokPattern, pattern2: GrokPattern) => {
          return pattern1.name.toLowerCase().localeCompare(pattern2.name.toLowerCase());
        });
        callback(patterns);
        return resp;
      },
      failCallback);
  },

  savePattern(pattern: GrokPattern, callback: () => void) {
    var failCallback = (error) => {
      UserNotification.error("保存 Grok 模式 \"" + pattern.name + "\" 失败: " + error.message,
        "无法保存Grok 模式");
    };

    const requestPattern = {
      id: pattern.id,
      pattern: pattern.pattern,
      name: pattern.name,
      'content_pack': pattern['content_pack'],
    };

    let url = this.URL;
    let method;
    if (pattern.id === "") {
      method = 'POST';
    } else {
      url += '/' + pattern.id;
      method = 'PUT';
    }
    fetch(method, url, requestPattern)
      .then(
        response => {
          callback();
          const action = pattern.id === "" ? "创建" : "更新";
          const message = "Grok 模式 \"" + pattern.name + "\" 成功 " + action;
          UserNotification.success(message);
          return response;
        },
        failCallback
      );
  },

  deletePattern(pattern: GrokPattern, callback: () => void) {
    var failCallback = (error) => {
      UserNotification.error("删除 Grok 模式 \"" + pattern.name + "\" 失败: " + error.message,
        "无法删除 Grok 模式");
    };
    fetch('DELETE', this.URL + "/" + pattern.id)
      .then(
        response => {
          callback();
          UserNotification.success("Grok 模式 \"" + pattern.name + "\" 删除成功");
          return response;
        },
        failCallback
      );
  },

  bulkImport(patterns: string, replaceAll: boolean) {
    var failCallback = (error) => {
      UserNotification.error("导入 Grok 模式文件失败: " + error.message,
        "无法导入Grok 模式");
    };

    const promise = fetchPlainText('POST', `${this.URL}?replace=${replaceAll}`, patterns);

    promise.catch(failCallback);

    return promise;
  },
};

module.exports = GrokPatternsStore;
