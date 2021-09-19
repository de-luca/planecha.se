<template>
  <div v-if="!hidden" class="card-container">

    <div v-if="hasCounters" class="counters tags has-addons">
      <span class="tag is-dark is-large minus" @click="update(-1)">-</span>
      <span class="tag is-dark is-large value">{{ card.counter.value }}</span>
      <span class="tag is-dark is-large plus" @click="update(1)">+</span>
    </div>

    <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">

  </div>
  <div v-else class="hidden">
    <img src="/cards/back.jpg">
  </div>
</template>

<script lang="ts">
import { Card as ModelCard, Phenomenon, Plane } from '@/model/card';
import { ActionTypes, Store, useStore } from '@/store';
import { prop, mixins } from 'vue-class-component';
import { Imgable } from '../Imgable';

class Props {
  public card = prop<ModelCard>({ required: true });
  public hidden = prop<boolean>({ required: false, default: false });
}

export default class Card extends mixins(Imgable).with(Props) {
  private store: Store;

  public created() {
    this.store = useStore();
  }

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
    this.store.dispatch(ActionTypes.COUNTERS, { planeId: this.card.id, change });
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;
}

img {
  width:100%;
  max-width:1000px;
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: var(--card-radius);

  &.phenomenon {
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
  }
}

.counters {
  position: absolute;
  right: 0;
  top: calc(-40px - .5rem);
  z-index: 2;

  .tag {
    &.minus, &.plus {
      cursor: pointer;
      width: 3rem;
    }

    &.value {
      width: 4rem;
    }
  }
}
</style>
