<template>
  <tip>
    <template #btn>
      <button
        title="Undo last action"
        class="button is-ghost"
        :disabled="!canUndo"
        @click="undo"
        @keyup.space.prevent
      >
        <fa icon="undo-alt" fixed-width size="lg" />
      </button>
    </template>
    <template #tip>
      {{ canUndo ? 'Undo last action' : 'No action to undo' }}
    </template>
  </tip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

@Component
export default class UndoBtn extends Vue {
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
