<template>
  <button
    class="button is-secondary is-rounded"
    title="Start Game"
    @click="start"
    @keyup.space.prevent
  >
    <fa icon="play-circle" size="4x" />
  </button>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useMain } from '@/store/main';

export default class StartBtn extends Vue {
  private store = useMain();

  public start() {
    this.store.startGame();
  }
}
</script>
