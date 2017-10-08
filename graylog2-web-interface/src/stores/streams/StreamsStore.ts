const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;
const lodash = require('lodash');

interface Stream {
  id: string;
  title: string;
  description: string;
  remove_matches_from_default_stream: boolean;
  isDefaultStream: boolean;
  creatorUser: string;
  createdAt: number;
}

interface TestMatchResponse {
  matches: boolean;
  rules: any;
}

interface Callback {
  (): void;
}

interface StreamSummaryResponse {
  total: number;
  streams: Array<Stream>;
}

class StreamsStore {
  private callbacks: Array<Callback> = [];

  listStreams() {
    const url = "/streams";
    const promise = fetch('GET', URLUtils.qualifyUrl(url))
        .then((result: StreamSummaryResponse) => result.streams)
        .catch((errorThrown) => {
          UserNotification.error("加载数据流失败: " + errorThrown,
              "无法加载数据流");
        });
    return promise;
  }
  load(callback: ((streams: Array<Stream>) => void)) {
    this.listStreams().then(streams => {
      callback(streams);
    });
  }
  get(streamId: string, callback: ((stream: Stream) => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("加载数据流失败: " + errorThrown,
        "无法加载数据流");
    };

    const url = ApiRoutes.StreamsApiController.get(streamId).url;
    fetch('GET', URLUtils.qualifyUrl(url)).then(callback, failCallback);
  }
  remove(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("删除数据流失败: " + errorThrown,
        "无法删除数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.delete(streamId).url);
    fetch('DELETE', url).then(callback, failCallback).then(this._emitChange.bind(this));
  }
  pause(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("停止数据流失败: " + errorThrown,
        "无法停止数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.pause(streamId).url);
    return fetch('POST', url)
      .then(callback, failCallback)
      .then(response => {
        this._emitChange();
        return response;
      });
  }
  resume(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("恢复数据流失败: " + errorThrown,
        "无法恢复数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.resume(streamId).url);
    return fetch('POST', url)
      .then(callback, failCallback)
      .then(response => {
        this._emitChange();
        return response;
      });
  }
  save(stream: any, callback: ((streamId: string) => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("保存数据流失败: " + errorThrown,
        "无法保存数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.create().url);
    fetch('POST', url, stream)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  update(streamId: string, data: any, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("更新数据流失败: " + errorThrown,
        "无法更新数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.update(streamId).url);
    fetch('PUT', url, data)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  cloneStream(streamId: string, data: any, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("复制数据流失败: " + errorThrown,
        "无法复制数据流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.cloneStream(streamId).url);
    fetch('POST', url, data)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  removeOutput(streamId: string, outputId: string, callback: (reponse) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamOutputsApiController.delete(streamId, outputId).url);

    fetch('DELETE', url).then(callback, (errorThrown) => {
      UserNotification.error("删除数据流失败: " + errorThrown,
        "无法删除数据流");
    }).then(this._emitChange.bind(this));
  }
  addOutput(streamId: string, outputId: string, callback: (errorThrown) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamOutputsApiController.add(streamId, outputId).url);
    fetch('POST', url, {outputs: [outputId]}).then(callback, (errorThrown) => {
      UserNotification.error("添加输出到数据流失败: " + errorThrown,
        "无法添加输出到数据流");
    }).then(this._emitChange.bind(this));
  }
  testMatch(streamId: string, message: any, callback: (response: TestMatchResponse) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.testMatch(streamId).url);
    fetch('POST', url, message).then(callback, (error) => {
      UserNotification.error("测试数据流规则失败: " + error.message,
        "无法测试数据流规则");
    });
  }
  onChange(callback: Callback) {
    this.callbacks.push(callback);
  }
  _emitChange() {
    this.callbacks.forEach((callback) => callback());
  }
  unregister(callback: Callback) {
    lodash.pull(this.callbacks, callback);
  }
}

const streamsStore = new StreamsStore();
export = streamsStore;

