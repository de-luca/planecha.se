<template>
  <button
    title="Undo last action"
    :disabled="!canUndo"
    @click="undo"
    @keyup.space.prevent
  >
    <span class="icon is-medium">
      <fa icon="undo-alt" fixed-width />
    </span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '@/store/main';

@Component
export default class UndoButton extends Vue {
  private store = useMain();

  public get canUndo(): boolean {
    return this.store.repo.head > 0;
  }

  public undo(): void {
    this.store.undo();
  }
}
</script>

<style lang="scss" scoped>
</style>
