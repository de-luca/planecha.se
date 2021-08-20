<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title" v-if="title" v-html="title"></h1>
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

      <div class="relevant" v-if="activeTab === 'relevant'">
        <template v-for="(c, index) in revealed.relevant" :key="c.id">
          <div
            class="card-wrapper"
            :style="{ transform: cardAngle(index, revealed.relevant.length) }"
          >
            <img :src="buildImgSrc(c)">
          </div>
        </template>
      </div>

      <div class="others" v-if="activeTab === 'others' && revealed.others.length > 0">
        <template v-for="(c, index) in revealed.others" :key="c.id">
          <div
            class="card-wrapper"
            :style="{ transform: cardAngle(index, revealed.others.length) }"
          >
            <img :src="buildImgSrc(c)">
          </div>
        </template>
      </div>
      <div class="others" v-if="activeTab === 'others' && revealed.others.length === 0">
        <em>Such Empty!</em>
      </div>

      <button
        v-if="!config.passive"
        class="button is-dark is-medium"
        @click="confirm"
      >
        Okay
      </button>
      <p class="subtitle" v-if="config.passive"><b>{{ mateName }}</b> is chosing.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, Vue } from 'vue-class-component';
import { BaseReveal } from './BaseReveal';
import { Card } from '@/model/card';
import { Wall } from '../wall/Wall';

@Options({
  emits: ['done'],
})
export default class Show extends mixins(Wall).with(BaseReveal) {
  private static readonly fanAngle = 5;

  private activeTab: string = 'relevant';

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
  }

  public cardAngle(i: number, total: number): string {
    const angle = (Show.fanAngle * i) - ((Show.fanAngle * (total - 1)) / 2);

    return `rotate(${angle.toFixed(2)}deg)`;
  }

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
@keyframes scale-center {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

.modal-content {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5rem;
}

.tabs {
  margin-bottom: 0;
}

.relevant, .others {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  gap: .5rem;

  height: 50%;
  padding-top: 1rem;
  padding-bottom: 1rem;

  .card-wrapper {
    position: absolute;
    transform-origin: center 2500px;

    &:hover {
      z-index: 2;
    }

    img {
      height: 20rem;

      &:hover {
        animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }
    }
  }
}

.others img {
  filter: grayscale(1);
}
</style>
