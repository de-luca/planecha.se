<template>
  <div class="card-container">

    <div
      v-if="hasCounters && current"
      class="counters active tags has-addons"
    >
      <span class="tag minus" @click="update(-1)">-</span>
      <span class="tag value">{{ card.counter.value }}</span>
      <span class="tag plus" @click="update(1)">+</span>
    </div>

    <span
      v-if="hasCounters && !current"
      class="counters inactive tag"
    >
      {{ card.counter.value }}
    </span>

    <img :src="imgSrc">

  </div>
</template>

<script lang="ts">
import { Plane } from '@/model/card';
import { ActionTypes, Store, useStore } from '@/store';
import { Vue, prop } from 'vue-class-component';

class Props {
  public card = prop<Plane>({ required: true });
  public current = prop<boolean>({ required: false, default: false });
}

export default class Card extends Vue.with(Props) {
  private store: Store;

  public created() {
    this.store = useStore();
  }

  public get imgSrc(): string {
    return `/cards/${this.card.id}.jpg`;
  }

  public get hasCounters(): boolean {
    return this.card.counter !== undefined;
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
  border-radius: 3.5% / 4.7%;
}

.counters {
  position: absolute;
  z-index: 2;

  &.active {
    top: -.75rem;
    right: -.5rem;

    .tag {
      &.minus, &.plus {
        cursor: pointer;
        width: 1.5rem;
      }

      &.value {
        width: 2rem;
      }
    }
  }

  &.inactive {
    width: 2rem;
    right: -.5rem;
    top: -.75rem;
  }
}
</style>
