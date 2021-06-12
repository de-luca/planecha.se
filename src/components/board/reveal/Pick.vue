<template>
  <div class="over">
    <div class="subtitle">Non Plane card revealed</div>
    <div class="others">
      <template v-for="c in revealed.others" :key="c.id">
        <img :src="buildImgSrc(c)">
      </template>
    </div>
    <div class="title">Choose plane to Planeswalk to</div>
    <div class="relevant">
      <template v-for="c in revealed.relevant" :key="c.id">
        <label>
          <img :src="buildImgSrc(c)">
          <input type="radio" :value="c" v-model="selected">
        </label>
      </template>
    </div>
    <button 
      class="button is-dark is-medium" 
      @click="confirm"
    >
      Confirm choice
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { BaseReveal, PickedLeft } from './BaseReveal';
import { Card } from '@/model/card';

@Options({
  emits: ['done'],
})
export default class Scry extends Vue.with(BaseReveal) {
  private selected: Card | null = null;

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
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

.over {
  background-color: #ffffffb5;
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

  width: 100%;
  padding-bottom: .5rem;

  z-index: 2;
}

.relevant {
  flex-wrap: wrap;
}


.others img {
  height: 10rem;
  filter: grayscale(1);
}

.relevant img {
  height: 15rem;

  &:hover {
    // animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}
</style>
