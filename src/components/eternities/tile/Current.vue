<template>
  <div
    title="You are here ;)"
    class="current"
    :class="{ multi: tile.plane.length > 1 }"
    @click="$emit('show')"
  >
    <card
      v-for="p in tile.plane"
      :key="p"
      :card="p"
      :current="true"
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
.current {
  z-index: 2;
  // box-shadow: -2px 3px 3px black;
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
