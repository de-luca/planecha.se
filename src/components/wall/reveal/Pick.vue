<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="source"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="tabs is-centered is-medium">
        <ul>
          <li :class="{ 'is-active': activeTab === 'relevant' }">
            <a @click="activeTab = 'relevant'">Relevant Cards ({{ revealed.relevant.length }})</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'others' }">
            <a @click="activeTab = 'others'">Others ({{ revealed.others.length }})</a>
          </li>
        </ul>
      </div>

      <div class="revealed">
        <div class="relevant" v-if="activeTab === 'relevant'">
          <template v-for="(c, index) in revealed.relevant" :key="c.id">
            <div
              class="card-wrapper"
              :style="cardTransform(index, revealed.relevant.length)"
            >
              <label>
                <input type="radio" :value="c" v-model="selected">
                <img :src="buildImgSrc(c)">
              </label>
            </div>
          </template>
        </div>

        <div class="others" v-if="activeTab === 'others' && revealed.others.length > 0">
          <template v-for="(c, index) in revealed.others" :key="c.id">
            <div
              class="card-wrapper"
              :style="cardTransform(index, revealed.others.length)"
            >
              <img :src="buildImgSrc(c)">
            </div>
          </template>
        </div>
        <div class="others" v-if="activeTab === 'others' && revealed.others.length === 0">
          <em>Such Empty!</em>
        </div>
      </div>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          :disabled="selected === null"
          @click="confirm"
        >
          Confirm choice
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Card } from '@/model/card';
import { BaseShow } from './BaseShow';
import { PickedLeft } from './BaseReveal';

export default class Pick extends mixins(BaseShow) {
  private selected: Card | null = null;

  public confirm(): void {
    const result: PickedLeft = {
      picked: [this.selected as Card],
      left: [],
    };
    this.revealed.relevant.forEach((c) => {
      if (c.id !== this.selected?.id) {
        result.left.push(c);
      }
    });
    this.revealed.others.forEach(c => result.left.push(c));

    this.$emit('done', result);
  }
}
</script>

<style lang="scss" scoped>
@import "./base-show";
</style>
