import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  connected: Boolean;
  logged: Boolean;
  username: string;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    connected: false,
    logged: false,
    username: "",
  },
  mutations: {
    connect(state) {
      state.connected = true;
    },
    login(state, username) {
      state.logged = true;
      state.username = username;
    },
  },
  actions: {},
  modules: {},
});

export function useStore() {
  return baseUseStore(key);
}
