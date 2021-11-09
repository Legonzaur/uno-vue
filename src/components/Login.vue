<template>
  <div id="login">
    <div>Game Status : {{ gameStatus }}</div>
    <span>Logged Users : </span>
    <ul id="loggedUsers">
      <li v-for="user in loggedUsers" :key="user">{{ user }}</li>
    </ul>
    <span>Choose Username : </span
    ><input
      type="text"
      v-model="username"
      @keyup="$event.key != 'Enter' || login()"
    />
    <button @click="login" :disabled="isLoading">{{ buttonText }}</button>
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
  isLoading: boolean;
  loggedUsers: string[];
  gameStatus: string;
  username: string;
  buttonText: string;
}

export default defineComponent({
  data() {
    return <Data>{
      isLoading: false,
      loggedUsers: [],
      gameStatus: "",
      username: "",
      buttonText: "Login",
    };
  },
  components: {},
  setup() {
    const store = useStore();
    const socket = getSocket();
    return { store, socket };
  },
  created() {
    this.getInfo();
  },
  props: {},
  methods: {
    async getInfo() {
      this.loggedUsers = (await this.socket.send("getLoggedUsers")).data;
      this.gameStatus =
        GameStatus[(await this.socket.send("getGameStatus")).data];
    },
    async login() {
      if (
        this.loggedUsers.indexOf(this.username) > -1 ||
        this.username.length < 1
      ) {
        this.buttonText = "Username already taken!";
        return;
      }
      this.isLoading = true;
      let usernameValidation = (await this.socket.send("login", this.username))
        .data;
      this.isLoading = false;
      if (!usernameValidation) {
        this.buttonText = "Username already taken!";
        return;
      }
      this.$store.commit("login", this.username);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
