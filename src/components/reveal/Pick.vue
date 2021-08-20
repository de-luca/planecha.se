<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title" v-if="title" v-html="title"></h1>
      <div v-if="revealed.others.length > 0" class="tabs is-centered is-medium">
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
            <label>
              <input type="radio" :value="c" :disabled="config.passive" v-model="selected">
              <img :src="buildImgSrc(c)">
            </label>
          </div>
        </template>
      </div>

      <div class="others" v-if="activeTab === 'others'">
        <template v-for="(c, index) in revealed.others" :key="c.id">
          <div
            class="card-wrapper"
            :style="{ transform: cardAngle(index, revealed.others.length) }"
          >
            <img :src="buildImgSrc(c)">
          </div>
        </template>
      </div>

      <button
        v-if="!config.passive"
        class="button is-dark is-medium"
        @click="confirm"
      >
        Confirm choice
      </button>
      <p class="subtitle" v-if="config.passive"><b>{{ mateName }}</b> is chosing.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { BaseReveal, PickedLeft } from './BaseReveal';
import { Card } from '@/model/card';
import { Wall } from '../wall/Wall';

@Options({
  emits: ['done'],
})
export default class Pick extends mixins(Wall).with(BaseReveal) {
  private static readonly fanAngle = 5;

  private selected: Card | null = null;
  private activeTab: string = 'relevant';

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
  }

  public cardAngle(i: number, total: number): string {
    const angle = (Pick.fanAngle * i) - ((Pick.fanAngle * (total - 1)) / 2);

    return `rotate(${angle.toFixed(2)}deg)`;
  }

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

.relevant, .others {
  display: flex;
  flex-direction: row;
  justify-content: center;
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

input[type="radio"] {
  display: none;

  &:checked+img {
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
  }
}
</style>
