<template>
  <div
    title="You are here ;)"
    class="current"
    :class="{ multi: tile.plane.length > 1 }"
    @click="$emit('show')"
  >
    <fa
      class="marker"
      icon="map-marker-alt"
      size="5x"
    />
    <card
      v-for="p in tile.plane"
      :key="p"
      :card="p"
      :current="true"
      :hasStarted="!hidden"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Props } from './Props';

import Card from '@/components/eternities/Card.vue';

@Options({
  emits: [ 'show' ],
  components: { Card },
})
export default class Current extends Vue.with(Props) {}
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
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--brand-color-secondary);
  }

  &:hover .marker {
    color: var(--brand-color-primary);
  }
}

.multi {
  width: 100%;
  position: relative;

  > div:first-child {
    position: absolute;
    top: -.75rem;
    left: -.75rem;
  }

  > div:last-child {
    position: absolute;
    bottom: -.75rem;
    right: -.75rem;
  }
}
</style>
