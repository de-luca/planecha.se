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
import { useMain } from '@/store/main';
import { Vue } from 'vue-class-component';

export default class UndoButton extends Vue {
  private store = useMain();

  public get canUndo(): boolean {
    return this.store.repository.getHead() > 0;
  }

  public undo(): void {
    this.store.revert(this.store.repository.getHead() - 1);
  }
}
</script>

<style lang="scss" scoped>
</style>
