<template>
  <div class="container">
    JOIN GAME
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Peer, { DataConnection } from 'peerjs';

export default defineComponent({

  name: 'JoinGame',
});
</script>

<style lang="scss" scoped>
.container {
  background-color: blue;
}
</style>