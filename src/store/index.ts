import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  connected: Boolean;
  logged: Boolean;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    connected: false,
    logged: false,
  },
  mutations: {},
  actions: {},
  modules: {},
});

export function useStore() {
  return baseUseStore(key);
}
