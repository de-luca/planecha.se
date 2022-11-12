<template>
  <div class="card-container">
    <div
      v-if="counters && current && hasStarted"
      class="counters active tags has-addons"
    >
      <span class="tag is-primary minus" @click.stop="update(-1)">-</span>
      <span class="tag is-primary value">{{ counters.value }}</span>
      <span class="tag is-primary plus" @click.stop="update(1)">+</span>
    </div>

    <div
      v-if="counters && !current"
      class="counters inactive tag is-primary"
    >
      {{ counters.value }}
    </div>

    <img :src="imgSrc">
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { Imgable } from '../../Imgable';
import { Counter, Plane } from '@/model/card';
import { useMain } from '@/store/main';

@Component
export default class Card extends Imgable {
  @Prop({ required: true })
  public card: Plane;
  @Prop({ required: false, default: false })
  public current: boolean;
  @Prop({ required: false, default: true })
  public hasStarted: boolean;

  private store = useMain();

  public get imgSrc(): string {
    return this.buildImgSrc(this.card);
  }

  public get counters(): Counter | undefined {
    if (this.card instanceof Plane) {
      return this.card.counter;
    }
    return undefined;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

img {
  border-radius: var(--card-radius);
  max-height: 100%;
}

.counters {
  position: absolute;
  z-index: 3;

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
