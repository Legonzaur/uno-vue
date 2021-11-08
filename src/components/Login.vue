<template>
  <div id="login">
    <span> Connect to server : </span>
    <input
      type="text"
      name="ip"
      v-model="serverIp"
      @keyup="$event.key != 'Enter' || login()"
    />
    <button @click="login" :disabled="isLoading">connect</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore, wsConnect } from "@/store";

export default defineComponent({
  data() {
    return { serverIp: "", isLoading: false };
  },
  components: {},
  setup() {
    const store = useStore();
    return { store };
  },
  props: {},
  methods: {
    login() {
      this.isLoading = true;
      wsConnect(this.serverIp)
        .then(() => {})
        .catch(() => {})
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
