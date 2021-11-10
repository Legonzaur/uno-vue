<template>
  <div id="login">
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
    this.socket.send("getLoggedUsers").then((message) => {
      this.loggedUsers = message.data;
    });
  },
  props: {},
  methods: {
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
