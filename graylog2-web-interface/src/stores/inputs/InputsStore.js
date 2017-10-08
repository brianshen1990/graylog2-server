import Reflux from 'reflux';

import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const InputStaticFieldsStore = StoreProvider.getStore('InputStaticFields');

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

const InputsStore = Reflux.createStore({
  listenables: [InputsActions],
  sourceUrl: '/system/inputs',
  inputs: undefined,
  input: undefined,

  init() {
    this.trigger({ inputs: this.inputs, input: this.input });
    this.listenTo(InputStaticFieldsStore, this.list);
  },

  list() {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl));
    promise
      .then(
        (response) => {
          this.inputs = response.inputs;
          this.trigger({ inputs: this.inputs });

          return this.inputs;
        },
        (error) => {
          UserNotification.error(`获取输入失败: ${error}`,
            '无法获取输入');
        });

    InputsActions.list.promise(promise);
  },

  get(inputId) {
    return this.getOptional(inputId, true);
  },

  getOptional(inputId, showError) {
    const promise = fetch('GET', URLUtils.qualifyUrl(`${this.sourceUrl}/${inputId}`));

    promise
      .then(
        (response) => {
          this.input = response;
          this.trigger({ input: this.input });

          return this.input;
        },
        (error) => {
          if (showError) {
            UserNotification.error(`获取输入 ${inputId} 失败: ${error}`,
                                   '无法获取输入');
          } else {
            this.trigger({ input: {} });
          }
        });

    InputsActions.get.promise(promise);
  },

  create(input) {
    const promise = fetch('POST', URLUtils.qualifyUrl(this.sourceUrl), input);
    promise
      .then(
        () => {
          UserNotification.success(`输入 '${input.title}' 开启成功`);
          InputsActions.list();
        },
        (error) => {
          UserNotification.error(`开启输入 '${input.title}' 失败: ${error}`,
            '无法开启输入');
        });

    InputsActions.create.promise(promise);
  },

  delete(input) {
    const inputId = input.id;
    const inputTitle = input.title;

    const promise = fetch('DELETE', URLUtils.qualifyUrl(`${this.sourceUrl}/${inputId}`));
    promise
      .then(
        () => {
          UserNotification.success(`输入 '${inputTitle}' 删除成功`);
          InputsActions.list();
        },
        (error) => {
          UserNotification.error(`删除输入 '${inputTitle}' 失败: ${error}`,
            '无法删除输入');
        });

    InputsActions.delete.promise(promise);
  },

  update(id, input) {
    const promise = fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl}/${id}`), input);
    promise
      .then(
        () => {
          UserNotification.success(`输出 '${input.title}' 更新成功`);
          InputsActions.list();
        },
        (error) => {
          UserNotification.error(`更新输入 '${input.title}' 失败: ${error}`,
            '无法更新输入');
        });

    InputsActions.update.promise(promise);
  },
});

InputsStore.inputsAsMap = (inputsList) => {
  const inputsMap = {};
  inputsList.forEach((input) => {
    inputsMap[input.id] = input;
  });
  return inputsMap;
};

export default InputsStore;
