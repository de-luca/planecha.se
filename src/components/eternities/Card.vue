<template>
  <div class="card-container">
    <div
      v-if="hasCounters && current"
      class="counters active tags has-addons"
    >
      <span class="tag is-primary minus" @click.stop="update(-1)">-</span>
      <span class="tag is-primary value">{{ card.counter.value }}</span>
      <span class="tag is-primary plus" @click.stop="update(1)">+</span>
    </div>

    <div
      v-if="hasCounters && !current"
      class="counters inactive tag is-primary"
    >
      {{ card.counter.value }}
    </div>

    <img :src="imgSrc">
  </div>
</template>

<script lang="ts">
import { Plane } from '@/model/card';
import { useMain } from '@/store/main';
import { prop, mixins } from 'vue-class-component';
import { Imgable } from '../Imgable';

class Props {
  public card = prop<Plane>({ required: true });
  public current = prop<boolean>({ required: false, default: false });
}

export default class Card extends mixins(Imgable).with(Props) {
  private store = useMain();

  public get imgSrc(): string {
    return this.buildImgSrc(this.card);
  }

  public get hasCounters(): boolean {
    return this.card.counter !== undefined;
  }

  public update(change: number): void {
    this.store.updateCounters({ planeId: this.card.id, change });
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;
  display: flex;
}

img {
  border-radius: var(--card-radius);
}

.counters {
  position: absolute;
  z-index: 2;

  &.active {
    top: -.5rem;
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
    top: -.5rem;
    right: -.5rem;
  }
}
</style>
