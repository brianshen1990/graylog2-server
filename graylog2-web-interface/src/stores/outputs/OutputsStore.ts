const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;

interface Output {
  id: string;
  title: string;
  type: string;
}

const OutputsStore = {
  OUTPUTS_URL: URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.index().url),

  load(callback : (outputs: Array<Output>) => void) {
    fetch('GET', this.OUTPUTS_URL).then(callback, this._failCallback);
  },
  loadForStreamId(streamId: string, callback: (outputs: Array<Output>) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamOutputsApiController.index(streamId).url);
    fetch('GET', url).then(callback, this._failCallback);
  },
  loadAvailableTypes(callback: (available: any) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.availableTypes().url);
    fetch('GET', url).then(callback, this._failCallback);
  },
  loadAvailable(typeName: string, callback: (available: any) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.availableTypes().url);
    fetch('GET', url).then((resp) => {
      return resp.types[typeName];
    }, this._failCallback).then(callback);
  },
  remove(outputId: string, callback: (error) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.delete(outputId).url);
    fetch('DELETE', url).then(callback, (error) => {
      UserNotification.error("停止输出失败: " + error,
        "无法停止输出");
    });
  },
  save(output: any, callback: (output: Output) => void) {
    const failCallback = (error) => {
      UserNotification.error("保存输出 \"" + output.title + "\" 错误: " + error,
        "保存输出");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.create().url);

    fetch('POST', url, output).then(callback, failCallback);
  },
  update(output: Output, deltas: any, callback: (output: Output) => void) {
    const failCallback = (error) => {
      UserNotification.error("更新输出 \"" + output.title + "\" 失败: " + error,
        "无法更新输出");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.OutputsApiController.update(output.id).url);

    fetch('PUT', url, deltas).then(callback, failCallback);
  },
  _failCallback(error: string) {
    UserNotification.error("导入输出失败: " + error,
      "无法导入输出");
  }
};

export = OutputsStore;
