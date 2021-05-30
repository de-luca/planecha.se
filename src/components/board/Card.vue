<template>
  <div class="card-container">

    <div v-if="hasCounters" class="counters buttons has-addons">
      <button @click="dec" class="button is-light is-rounded"><i class="fad fa-fw fa-minus"></i></button>
      <div class="button is-light">{{ card.counter.value }}</div>
      <button @click="inc" class="button is-light is-rounded"><i class="fad fa-fw fa-plus"></i></button>
    </div>

    <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">

  </div>
</template>

<script lang="ts">
import { Card as ModelCard, Phenomenon, Plane } from '@/model/card';
import { MutationTypes, Store, useStore } from '@/store';
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

  public inc() {
    this.store.commit(MutationTypes.INC_COUNTERS, this.card.id);
  }

  public dec() {
    this.store.commit(MutationTypes.DEC_COUNTERS, this.card.id);
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;
}

img {
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: 38px;

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
