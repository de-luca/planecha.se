<template>
  <div class="card-container">

    <div v-if="hasCounters" class="counters buttons has-addons">
      <button @click="update(-1)" class="button is-light is-rounded">-</button>
      <div class="button is-light">{{ card.counter.value }}</div>
      <button @click="update(1)" class="button is-light is-rounded">+</button>
    </div>

    <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">

  </div>
</template>

<script lang="ts">
import { Card as ModelCard, Phenomenon, Plane } from '@/model/card';
import { ActionTypes, Store, useStore } from '@/store';
import { Vue, prop } from 'vue-class-component';

class Props {
  public card = prop<ModelCard>({ required: true });
}

export default class Card extends Vue.with(Props) {
  private store: Store;

  public created() {
    this.store = useStore();
  }

  public get imgSrc(): string {
    return `/cards/${this.card.id}.png`;
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
  filter: drop-shadow(1px 1px 1px #585858);

  &.phenomenon {
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
  }
}

.counters {
  position: absolute;
  right: 0;
  top: -1.5rem;
  z-index: 2;
}
</style>
