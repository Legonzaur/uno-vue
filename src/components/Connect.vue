<template>
  <div id="connect">
    <span> Connect to server : </span>
    <input
      type="text"
      name="ip"
      v-model="serverIp"
      @keyup="$event.key != 'Enter' || connect()"
    />
    <button @click="connect" :disabled="isLoading">{{ buttonText }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "@/store";

import { wsConnect } from "@/socket";

interface Data {
  serverIp: string;
  isLoading: boolean;
  buttonText: string;
}
export default defineComponent({
  data() {
    return <Data>{
      serverIp: "localhost:8081",
      isLoading: false,
      buttonText: "Connect",
    };
  },
  components: {},
  setup() {
    const store = useStore();
    return { store };
  },
  props: {},
  methods: {
    connect() {
      this.isLoading = true;
      wsConnect(this.serverIp)
        .then(() => {
          this.buttonText = "Connected";
          this.$store.commit("connect");
        })
        .catch(() => {
          this.buttonText = "Connection failed";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
