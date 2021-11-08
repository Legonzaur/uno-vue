<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <Connect v-if="!connected" />
  <Login v-if="connected && !logged" />
  <Game v-if="connected && logged" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Game from "./components/Game.vue";
import Connect from "./components/Connect.vue";
import Login from "./components/Login.vue";

import { useStore } from "@/store";

@Options({
  components: {
    Game,
    Connect,
    Login,
  },
  setup() {
    const store = useStore();
    return { store };
  },
  computed: {
    connected() {
      return this.$store.state.connected;
    },
    logged() {
      return this.$store.state.logged;
    },
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
