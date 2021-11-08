import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  socket: WebSocket;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    socket: null as unknown as WebSocket,
  },
  mutations: {
    setSocket(state: State, payload) {
      state.socket = payload;
    },
  },
  actions: {},
  modules: {},
});

export function useStore() {
  return baseUseStore(key);
}

export function wsConnect(url: String) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("ws://" + url);
    socket.onopen = function (event) {
      socket.send("Hello Server!");
      store.commit("setSocket", socket);
      resolve(event);
    };

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log("Message from server ", event.data);
    });

    socket.addEventListener("error", function (event) {
      reject(event);
    });
  });
}
