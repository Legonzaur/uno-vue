<template>
  <div id="connect">
    <span> Connect to server : </span>
    <input
      type="text"
      name="ip"
      v-model="serverIp"
      @keyup="$event.key != 'Enter' || connect()"
    />
    <button @click="login" :disabled="isLoading">{{ buttonText }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore, wsConnect } from "@/store";

export default defineComponent({
  data() {
    return {
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
