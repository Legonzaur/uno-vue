<template>
  <div id="game"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "@/store";

export default defineComponent({
  components: {},
  setup() {
    const store = useStore();
    return { store };
  },
  props: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
