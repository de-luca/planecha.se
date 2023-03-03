<template>
  <div
    v-if="tile"
    title="You are here ;)"
    class="current"
    :class="{ multi: tile!.plane.length > 1 }"
    @click="$emit('show')"
  >
    <fa
      class="marker"
      icon="map-marker-alt"
      size="2x"
    />
    <card
      v-for="p in tile!.plane"
      :key="p"
      :card="p"
      :current="true"
      :hasStarted="!hidden"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import Card from '../Card.vue';
import { Tile } from '#/model/map/eternities';

@Component({
  emits: [ 'show' ],
  components: { Card },
})
export default class Current extends Vue {
  @Prop({ required: false })
  public tile: Tile;
  @Prop({ required: true })
  public hidden: boolean;
}
</script>

<style lang="scss" scoped>
img {
  border-radius: var(--card-radius);
}

.current {
  position: relative;
  z-index: 2;

  .marker {
    z-index: 3;
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: var(--brand-color-secondary);
  }

  &:hover .marker {
    color: var(--brand-color-primary);
  }
}

.multi {
  width: 100%;
  position: relative;

  div:first-of-type {
    position: absolute;
    top: -.5rem;
    left: -1rem;
  }

  div:last-of-type {
    position: absolute;
    bottom: -.5rem;
    right: -1rem;
  }
}
</style>
