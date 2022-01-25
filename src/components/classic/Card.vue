<template>
  <div v-if="!hidden" class="card-container">

    <div v-if="hasCounters" class="counters tags has-addons">
      <span class="tag is-primary is-large minus" @click="update(-1)">-</span>
      <span class="tag is-primary is-large value">{{ card.counter.value }}</span>
      <span class="tag is-primary is-large plus" @click="update(1)">+</span>
    </div>

    <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">

  </div>
  <div v-else class="hidden">
    <img src="/cards/back.jpg">
  </div>
</template>

<script lang="ts">
import { prop, mixins } from 'vue-class-component';
import { Card as ModelCard, Phenomenon, Plane } from '@/model/card';
import { useMain } from '@/store/main';
import { Imgable } from '../Imgable';

class Props {
  public card = prop<ModelCard>({ required: true });
  public hidden = prop<boolean>({ required: false, default: false });
}

export default class Card extends mixins(Imgable).with(Props) {
  private store = useMain();

  public get imgSrc(): string {
    return this.buildImgSrc(this.card);
  }

  public get hasCounters(): boolean {
    if (this.card instanceof Plane) {
      return this.card.counter !== undefined;
    }
    return false;
  }

  public get isPhenomenon(): boolean {
    return this.card instanceof Phenomenon;
  }

  public update(change: number) {
    this.store.updateCounters({ planeId: this.card.id, change });
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;
}

img {
  max-height: calc(100vh - 4rem - (3 * 1rem));
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: var(--card-radius);

  &.phenomenon {
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
  }
}

.counters {
  position: absolute;
  right: 0;
  top: calc(-25px - .5rem);
  z-index: 421;

  .tag {
    height: 1.75rem;

    &.minus, &.plus {
      cursor: pointer;
      width: 2rem;
    }

    &.value {
      width: 3rem;
    }
  }
}
</style>
