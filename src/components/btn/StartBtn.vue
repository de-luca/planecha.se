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
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '@/store/main';

@Component
export default class StartBtn extends Vue {
  private store = useMain();

  public start() {
    this.store.startGame();
  }
}
</script>
