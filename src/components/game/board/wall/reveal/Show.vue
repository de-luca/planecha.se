<template>
  <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="muted"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="tabs is-centered is-medium" v-if="revealed.others.length > 0">
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
          <div class="card-wrapper" v-for="c in revealed.relevant" :key="c.id">
            <img :src="buildImgSrc(c)">
          </div>
        </div>

        <div class="others" v-if="activeTab === 'others' && revealed.others.length > 0">
          <div class="card-wrapper" v-for="c in revealed.others" :key="c.id">
            <img :src="buildImgSrc(c)">
          </div>
        </div>

        <div class="others empty" v-if="activeTab === 'others' && revealed.others.length === 0">
          <em>Such Empty!</em>
        </div>
      </div>

      <div class="confirm">
        <button class="button is-secondary is-medium" @click="confirm">
          Okay
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { RevealConfig } from './types';
import { Imgable } from '#/components/Imgable';
import { Revealed } from '#/model/map';

@Component({ emits: ['done'] })
export default class Show extends Imgable {
  @Prop({ required: true })
  public revealed: Revealed;
  @Prop({ required: true })
  public config: RevealConfig;

  public activeTab = 'relevant';

  public confirm(): void {
    const picked = this.config.sendShownTo === 'top' ? this.revealed.relevant : [];
    const left = this.revealed.others.concat(
      this.config.sendShownTo === 'top'
        ? []
        : this.revealed.relevant,
    );

    this.$emit('done', { picked, left });
  }
}
</script>

<style lang="scss" scoped>
$card-width: 40vw;
@import "../scss/multi-reveal";
</style>
