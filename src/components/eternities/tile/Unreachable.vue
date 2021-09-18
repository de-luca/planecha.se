<template>
  <div
    class="unreachable"
    :class="{ multi: tile.plane.length > 1 }"
    @click="$emit('show')"
  >
    <template v-for="p in tile.plane" :key="p">
      <card :card="p" />
    </template>
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
export default class Unreachable extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
.unreachable {
  filter: grayscale(90%);
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
