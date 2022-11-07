<template>
  <div v-if="!hidden" class="card-container">

    <div v-if="counters" class="counters tags has-addons">
      <span class="tag is-primary is-medium minus" @click="update(-1)">
        <fa icon="minus" fixed-width />
      </span>
      <span class="tag is-primary is-medium value">
        {{ counters.value }}
      </span>
      <span class="tag is-primary is-medium plus" @click="update(1)">
        <fa icon="plus" fixed-width />
      </span>
    </div>

    <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">

  </div>
  <div v-else class="hidden">
    <img src="/cards/back.jpg">
  </div>
</template>

<script lang="ts">
import { prop, mixins } from 'vue-class-component';
import { Imgable } from '../../Imgable';
import { Card as ModelCard, Counter, Phenomenon, Plane } from '@/model/card';
import { useMain } from '@/store/main';

class Props {
  public card = prop<ModelCard>({ required: true });
  public hidden = prop<boolean>({ required: false, default: false });
}

export default class Card extends mixins(Imgable).with(Props) {
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
    filter:
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
    ;
  }
}

.counters {
  position: absolute;
  right: 0;
  top: calc(-25px - 1rem);
  z-index: 421;

  .tag {
    font-weight: bolder;

    &.value {
      width: 2rem;
    }

    &.minus, &.plus {
      cursor: pointer;
    }
  }
}
</style>
