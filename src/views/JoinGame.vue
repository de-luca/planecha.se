<template>
  <div class="container">
    <div class="field">
      <label class="label">Room ID</label>
      <div class="control">
        <input class="input" type="text" placeholder="00000000-0000-0000-0000-000000000000">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-fullwidth">Join</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class JoinGame extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
}
</style>
