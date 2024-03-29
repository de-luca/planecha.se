<template>
  <div v-if="!hidden">
    <div class="card-container">
      <div v-if="counters" class="counters tags has-addons">
        <span v-if="!ro" class="tag is-primary minus" @click.stop="update(-1)">
          <fa icon="minus" fixed-width />
        </span>
        <span class="tag is-primary value">
          {{ counters.value }}
        </span>
        <span v-if="!ro" class="tag is-primary plus" @click.stop="update(1)">
          <fa icon="plus" fixed-width />
        </span>
      </div>
      <img :class="{ phenomenon: isPhenomenon }" :src="imgSrc">
    </div>
  </div>
  <div v-else class="hidden">
    <img src="/cards/back.jpg">
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { Imgable } from '#/components/Imgable';
import { Card as ModelCard, Counter, Phenomenon, Plane } from '#/model/card';
import { useMain } from '#/store/main';

@Component
export default class Card extends Imgable {
  @Prop({ required: true })
  public card: ModelCard;
  @Prop({ required: false, default: false })
  public hidden: boolean;
  @Prop({ required: false, default: false })
  public ro: boolean;

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
  height: inherit;
  width: fit-content;
  position: relative;
}

img {
  width: 100%;
  max-height: 100%;
  max-width: 800px;
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: var(--card-radius);
  object-fit: scale-down;

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
  top: -1.75rem;
  z-index: 10;

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
