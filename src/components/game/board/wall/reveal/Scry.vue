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
        <div class="side">
          <div class="subtitle">To the top</div>
          <draggable :list="toTop" item-key="id" group="scry" class="box drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>

        <div class="side">
          <div class="subtitle">Revealed cards</div>
          <draggable :list="base" item-key="id" group="scry" class="drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>

        <div class="side">
          <div class="subtitle">To the bottom</div>
          <draggable :list="toBottom" item-key="id" group="scry" class="box drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          @click="confirm"
          :disabled="base.length > 0"
        >
          Confirm choice
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import * as draggable from 'vuedraggable';

import { Component, Prop } from 'vue-facing-decorator';
import { WallConfig } from '../types';
import { RevealConfig } from './types';
import { Imgable } from '#/components/Imgable';
import { Revealed } from '#/model/map';
import { Card } from '#/model/card';

@Component({
  emits: ['done'],
  components: { draggable },
})
export default class Test extends Imgable {
  @Prop({ required: true })
  public revealed: Revealed;
  @Prop({ required: true })
  public config: RevealConfig & WallConfig;

  public picked: Record<string, boolean> = {};
  public id = Math.random().toString(36).substring(2, 15);


  public base: Array<Card> = [];
  public toTop: Array<Card> = [];
  public toBottom: Array<Card> = [];

  public created() {
    this.base = [...this.revealed.relevant];
  }

  public confirm(): void {
    this.$emit('done', {
      picked: [...this.toTop],
      left: [...this.revealed.others, ...this.toBottom],
    });
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/header';
@import '../scss/modal-content';
@import '../scss/confirm';

.modal-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 50vh 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "revealed"
    "confirm"
  ;

  .revealed {
    height: 100%;
    grid-area: revealed;
    display: flex;
    flex-direction: row;

    .side {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      margin: 0;

      .drag {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        text-align: center;
        background-color: transparent;
        overflow-y: scroll;

        &.box {
          border: 1px solid var(--border-color);
          color: var(--text-color);
        }
      }
    }
  }

  .card-wrapper {
    position: unset;
    min-height: 3rem;
    max-height: 3rem;
    height: 3rem;

    &:hover, &:active {
      z-index: 2;
    }

    img {
      width: auto;
      max-height: 30vh;
      border-radius: var(--card-radius);
      filter: drop-shadow(1px 1px 1px #585858);
      cursor: all-scroll;
    }
  }
}
</style>
