<template>
  <div
    v-if="!hidden"
    title="Planeswalk"
    class="planeswalkable"
    :class="{ multi: tile.plane.length > 1 }"
    @click="$emit('show')"
  >
    <card
      v-for="p in tile.plane"
      :key="p"
      :card="p"
    />
  </div>
  <div v-else class="hidden">
    <img src="/cards/back.jpg">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Props } from './Props';

import Card from '@/components/map/eternities/Card.vue';

@Options({
  emits: [ 'show' ],
  components: { Card },
})
export default class Planeswalkable extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
img {
  border-radius: var(--card-radius);
  max-height: 100%;
}

.planeswalkable:hover {
  z-index: 3;
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
