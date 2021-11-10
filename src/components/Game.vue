<template>
  <div id="game">
    <div>Game Status : {{ gameStatus }}</div>
    <span>Logged Users : </span>
    <ul id="loggedUsers">
      <li v-for="user in loggedUsers" :key="user">{{ user }}</li>
    </ul>
    <button v-if="logged && gameStatus == 'Waiting'">{{ buttonText }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "@/store";

import { getSocket } from "@/socket";

enum GameStatus {
  Waiting,
  Ongoing,
  Finished,
}

interface Data {
  loggedUsers: string[];
  gameStatus: string;
  buttonText: string;
}

export default defineComponent({
  data() {
    return <Data>{
      isLoading: false,
      loggedUsers: [],
      gameStatus: "",
      username: "",
      buttonText: "StartGame",
    };
  },
  components: {},
  setup() {
    const store = useStore();
    const socket = getSocket();
    return { store, socket };
  },
  computed: {
    logged() {
      return this.$store.state.logged;
    },
  },
  created() {
    this.socket.functions.updateLoggedUsers = (loggedUsers: string[]) => {
      this.loggedUsers = loggedUsers;
    };
    this.socket.send("getLoggedUsers").then((message) => {
      this.loggedUsers = message.data;
    });
    this.socket.send("getGameStatus").then((message) => {
      this.gameStatus = GameStatus[message.data];
    });
  },
  props: {},
  methods: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
