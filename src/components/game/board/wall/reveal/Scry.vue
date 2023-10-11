<template>
  <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="muted" v-if="config.mateName"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="revealed">
        <div v-for="(c, index) in revealed.relevant" :key="c.id" class="card-wrapper">
          <img :src="buildImgSrc(c)">
          <div class="control to-top">
            <input
              type="radio"
              :id="id + index + 'top'"
              :value="true"
              v-model="picked[c.id]"
            >
            <label class="button" :for="id + index + 'top'">
              Keep on top
            </label>
          </div>
          <div class="control to-bottom">
            <input
              type="radio"
              :id="id + index + 'bottom'"
              :value="false"
              v-model="picked[c.id]"
            >
            <label class="button" :for="id + index + 'bottom'">
              Put at the bottom
            </label>
          </div>
        </div>
      </div>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          @click="confirm"
          :disabled="!allSet"
        >
          Confirm choice
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { WallConfig } from '../types';
import { PickedLeft, RevealConfig } from './types';
import { Imgable } from '#/components/Imgable';
import { Revealed } from '#/model/map';

@Component({ emits: ['done'] })
export default class Scry extends Imgable {
  @Prop({ required: true })
  public revealed: Revealed;
  @Prop({ required: true })
  public config: RevealConfig & WallConfig;

  public picked: Record<string, boolean> = {};
  public id = Math.random().toString(36).substring(2, 15);

  public get allSet(): boolean {
    return this.revealed.relevant.every(c => this.picked[c.id] !== undefined);
  }

  public confirm(): void {
    const result: PickedLeft = { picked: [], left: [] };

    result.left.push(...this.revealed.others);
    this.revealed.relevant
      .forEach(c => (this.picked[c.id] ? result.picked : result.left)
      .push(c));

    this.$emit('done', result);
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/header';
@import '../scss/modal-content';
@import '../scss/confirm';

.modal-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, auto);
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "revealed"
    "confirm"
  ;
}

.revealed {
  grid-area: revealed;

  .card-wrapper {
    @media screen and (max-width: 800px) and (orientation: portrait) {
      grid-template-rows: repeat(3, auto);
      grid-template-columns: 1fr;
      row-gap: .5rem;
      grid-template-areas:
        "card"
        "to-top"
        "to-bottom"
      ;

      .to-top {
        justify-content: center !important;
      }
      .to-bottom {
        justify-content: center !important;
      }
    }

    @media screen and (max-height: 450px) and (orientation: landscape) {
      grid-template-rows: 1fr;
      grid-template-columns: repeat(3, auto);
      row-gap: .5rem;
      grid-template-areas:
        "to-top card to-bottom"
      ;

      .control.to-top label {
        writing-mode: sideways-rl;
        width: unset !important;
        height: 100%;
        max-height: 50vh;
      }
      .control.to-bottom label {
        writing-mode: sideways-lr;
        width: unset !important;
        height: 100%;
        max-height: 50vh;
      }
    }

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    column-gap: 1rem;
    row-gap: 1rem;
    grid-template-areas:
      "card   card"
      "to-top to-bottom"
    ;

    .control {
      display: flex;

      label {
        width: var(--form-btn-width);
        color: var(--modal-picker-color);
        background-color: var(--modal-picker-bg);
        border-color: var(--modal-picker-border);
      }

      input[type="radio"] {
        display: none;

        &:checked+label {
          border-color: var(--modal-picker-checked-border);
        }
      }
    }

    img {
      grid-area: card;
      max-height: 50vh;
      max-width: calc(100vw - 1rem);
      border-radius: var(--card-radius);
    }

    .to-top {
      grid-area: to-top;
      justify-content: flex-end;
    }

    .to-bottom {
      grid-area: to-bottom;
      justify-content: flex-start;
    }
  }
}
</style>
