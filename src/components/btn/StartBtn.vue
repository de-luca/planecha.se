<template>
  <button
    class="button is-light is-rounded"
    title="Start Game"
    @click="start"
  >
    <fa icon="play-circle" size="6x" />
  </button>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { ActionTypes, Store, useStore } from '@/store';

export default class StartBtn extends Vue {
  private store: Store;

  public created() {
    this.store = useStore();
  }

  public start() {
    this.store.dispatch(ActionTypes.START_GAME);
  }
}
</script>
