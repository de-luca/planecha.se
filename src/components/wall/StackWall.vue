<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <h1 class="title">Order the triggers on the stack</h1>
        <h2 class="subtitle">Effets will resolve <b>top to bottom</b>.</h2>
      </div>

      <draggable
        :list="active"
        class="stack"
        ghost-class="ghost"
      >
        <template #item="{ element }">
          <div class="card-wrapper">
            <img :src="buildImgSrc(element)" />
          </div>
        </template>
      </draggable>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          @click="done"
        >
          Confirm choice
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import * as draggable from 'vuedraggable';
import { Component } from 'vue-facing-decorator';
import { Imgable } from '@/components/Imgable';
import { useMain } from '@/store/main';
import { Card as ModelCard } from '@/model/card';

@Component({
  emits: [ 'done' ],
  components: { draggable },
})
export default class StackWall extends Imgable {
  public active: Array<ModelCard> = [...useMain().map.active];

  public done(): void {
    this.$emit('done', this.active);
  }
}
</script>

<style lang="scss" scoped>
@use "sass:math";

@import './scss/header';
@import './scss/modal-content';
@import './scss/confirm';

$card-width: 40vw;

@keyframes move-left {
  0% { transform: translateX(0) }
  100% { transform: translateX(-2rem) }
}

@keyframes move-right {
  0% { transform: translateX(-2rem) }
  100% { transform: translateX(0) }
}

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

  flex-direction: column;
  justify-content: flex-start !important;

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .card-wrapper {
    position: unset;

    min-height: 5rem;
    max-height: 5rem;
    height: 5rem;
    min-width: math.div($card-width, 2);

    &:hover, &:active {
      z-index: 2;
    }

    img {
      max-width: calc(100vw - 1rem);
      max-height: 40vh;
      border-radius: var(--card-radius);
      filter: drop-shadow(1px 1px 1px #585858);
      animation: move-left 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

      &:hover {
        animation: move-right 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }
    }
  }
}
</style>
