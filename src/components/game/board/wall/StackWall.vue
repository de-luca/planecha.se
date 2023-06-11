<template>
  <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <h1 class="title">Order the triggers on the stack</h1>
        <h2 class="subtitle">Effets will resolve <b>top to bottom</b>.</h2>
      </div>

      <div class="stack">
        <draggable :list="active" item-key="id" class="box drag">
          <template #item="{ element }">
            <div class="box">{{ element.name }}</div>
          </template>
        </draggable>
      </div>

      <div class="confirm">
        <button class="button is-secondary is-medium" @click="done">
          Confirm choice
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import * as draggable from 'vuedraggable';
import { Component, Prop } from 'vue-facing-decorator';
import { Imgable } from '#/components/Imgable';
import { useMain } from '#/store/main';
import { Card } from '#/model/card';

@Component({
  emits: [ 'done' ],
  components: { draggable },
})
export default class StackWall extends Imgable {
  @Prop({ required: true })
  public cards: Array<Card> | null;
  public active: Array<Card> = [];

  public created(): void {
    this.active = [...(this.cards ?? useMain().map.active)];
  }

  public done(): void {
    this.$emit('done', this.active);
  }
}
</script>

<style lang="scss" scoped>
@import './scss/header';
@import './scss/modal-content';
@import './scss/confirm';

$card-width: 40vw;

.modal-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 2fr 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "stack"
    "confirm"
  ;
}

.stack {
  grid-area: stack;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .drag {
    width: 50vw;
    display: flex;
    flex-direction: column;
    gap: .5rem;

    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);

    max-height: 45vh;
    overflow-y: scroll;

    .box {
      margin-bottom: 0;
      cursor: all-scroll;

      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      color: var(--text-color);
    }
  }
}
</style>
